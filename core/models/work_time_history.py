from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class WorkTimeHistory(TimeStampedModel):
    user = models.ForeignKey('core.User', verbose_name=_('Пользователь'), on_delete=models.CASCADE)
    task = models.ForeignKey(
        'core.Task',
        verbose_name=_('Задача'),
        related_name='work_time_history',
        on_delete=models.CASCADE,
    )
    work_date = models.DateField('Дата работы', null=True)
    work_hours = models.FloatField('Потрачено рабочих часов')
    minus_work_time = models.BooleanField('Сминусовать отработанное время', default=False)
    text = models.TextField(default='')

    class Meta:
        verbose_name = _('Запись о списании времени')
        verbose_name_plural = _('Записи о списании времени')

    def __str__(self):
        work_hours = f'{"-" if self.minus_work_time else ""}{self.work_hours}'
        return f'User #{self.user.pk}, {work_hours}h. , Task#{self.task.pk}'
