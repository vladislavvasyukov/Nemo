from django.db import models, transaction
from django.db.models import Sum
from django.utils.translation import ugettext_lazy as _
from djchoices import DjangoChoices, ChoiceItem

from model_utils.models import TimeStampedModel


class TaskNegativeTotalWorkTimeError(Exception):
    def __init__(self, work_hours=None):
        total_seconds = (work_hours or 0.0)*3600.0
        negative = total_seconds < 0
        if negative:
            total_seconds = -total_seconds
        seconds = total_seconds % 60
        minutes = total_seconds // 60 % 60
        hours = total_seconds // 3600

        time_str = " минус" if negative else ""
        if hours > 0:
            time_str += " {:.0f} ч".format(hours)
        if minutes > 0:
            time_str += " {:.0f} мин".format(minutes)
        if not hours and not minutes:
            time_str += " {:.0f} с".format(seconds)

        message = 'Суммарное время сотрудника не может быть отрицательным:{}'.format(time_str)

        super(TaskNegativeTotalWorkTimeError, self).__init__(message)


class Task(TimeStampedModel):

    class Status(DjangoChoices):
        draft = ChoiceItem(value=0, label=_("Ожидает"))
        enqueued = ChoiceItem(value=1, label=_('В очереди'))
        in_progress = ChoiceItem(value=2, label=_('выполняется'))
        to_accept = ChoiceItem(value=3, label=_('на проверке'))
        completed = ChoiceItem(value=4, label=_('выполнена'))
        rejected = ChoiceItem(value=5, label=_('отклонена'))
        canceled = ChoiceItem(value=6, label=_('отменена'))
        pending = ChoiceItem(value=7, label=_('приостановлена'))

    WORK_STATUSES = [Status.enqueued, Status.in_progress]

    title = models.CharField(max_length=255, verbose_name=_('Заголовок'))
    description = models.TextField(_('Описание'))
    status = models.PositiveSmallIntegerField(_("Статус"), choices=Status, default=Status.enqueued)
    deadline = models.DateField(verbose_name=_('Дедлайн'), null=True, blank=True)
    work_hours = models.FloatField(_('Трудоёмкость'), null=True, blank=True)
    planned_work_hours = models.FloatField(_('Плановая трудоёмкость'), null=True, blank=True)

    executor = models.ForeignKey(
        'core.User', 
        verbose_name=_('Исполнитель'), 
        related_name='tasks_to_execute', 
        on_delete=models.PROTECT,
    )
    manager = models.ForeignKey(
        'core.User', 
        verbose_name=_('Приёмщик'), 
        related_name='manager_tasks',
        on_delete=models.PROTECT,
    )
    author = models.ForeignKey(
        'core.User', 
        verbose_name=_('Автор'), 
        related_name='author_tasks', 
        on_delete=models.PROTECT,
    )
    participants = models.ManyToManyField('core.User', related_name='tasks', verbose_name=_('Участники задачи'))

    tags = models.ManyToManyField('core.Tag', related_name='tasks', verbose_name=_('Теги'))
    project = models.ForeignKey('core.Project', verbose_name=_('Проект'), on_delete=models.PROTECT)

    class Meta:
        verbose_name = _('Задача')
        verbose_name_plural = _('Задачи')

    def __str__(self):
        return self.title

    @property
    def members_pks(self):
        participant_pks = self.participants.values_list('pk', flat=True)
        all_user_ids = set(participant_pks) | {self.author_id, self.manager_id, self.executor_id} - {None}
        return all_user_ids

    def add_work_time(self, user, work_date, text, work_time, minus_work_time=False):
        work_hours = work_time.total_seconds() / 3600.0 * (-1.0 if minus_work_time else 1.0)

        with transaction.atomic():
            self.work_time_history.create(
                user=user,
                work_date=work_date,
                text=text,
                work_hours=work_hours,
                minus_work_time=minus_work_time
            )
            self.ensure_non_negative_work_time(user)
            self.work_hours = self.work_time_history.aggregate(work_hours=Sum('work_hours'))['work_hours'] or 0
            self.save()

    def ensure_non_negative_work_time(self, user):
        user_work_hours = self.work_time_history.filter(
            user=user,
        ).aggregate(
            work_hours=Sum('work_hours')
        )['work_hours'] or 0
        if user_work_hours < 0 < round(abs(user_work_hours * 3600.0)):
            raise TaskNegativeTotalWorkTimeError(user_work_hours)
