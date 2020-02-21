from django.db import models
from django.utils.translation import ugettext_lazy as _
from djchoices import DjangoChoices, ChoiceItem

from model_utils.models import TimeStampedModel


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
