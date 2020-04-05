from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Project(TimeStampedModel):
    name = models.CharField(max_length=255, verbose_name='Название')
    company = models.ForeignKey(
        'core.Company',
        verbose_name=_('Компания'),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _('Проект')
        verbose_name_plural = _('Проекты')

    def __str__(self):
        return self.name
