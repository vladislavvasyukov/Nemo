from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Project(TimeStampedModel):
    name = models.CharField(max_length=255, verbose_name='Название')

    class Meta:
        verbose_name = _('Проект')
        verbose_name_plural = _('Проекты')

    def __str__(self):
        return self.name
