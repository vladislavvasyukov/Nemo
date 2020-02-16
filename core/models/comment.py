from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Comment(TimeStampedModel):
    text = models.TextField(default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('core.User', verbose_name=_('Пользователь'), on_delete=models.CASCADE)
    task = models.ForeignKey('core.Task', verbose_name=_('Задача'), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('Комментариий')
        verbose_name_plural = _('Комментариии')

    def __str__(self):
        return self.text
