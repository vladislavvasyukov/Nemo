from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Notification(TimeStampedModel):
    comment = models.ForeignKey('core.Comment', verbose_name=_('Комментарий'), on_delete=models.CASCADE)
    user = models.ForeignKey('core.User', verbose_name=_('Пользователь'), on_delete=models.CASCADE)
    date_read = models.DateTimeField(_('Прочитано'), null=True)

    class Meta:
        verbose_name = _('Уведомление')
        verbose_name_plural = _('Уведомления')
