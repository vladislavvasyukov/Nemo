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
    creator = models.ForeignKey(
        'core.User',
        verbose_name=_('Создатель'),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    description = models.TextField(_('Описание'), default='')
    participants = models.ManyToManyField(
        'core.User',
        related_name='participate_projects',
        verbose_name=_('Участники проекта'),
    )

    class Meta:
        verbose_name = _('Проект')
        verbose_name_plural = _('Проекты')

    def __str__(self):
        return self.name

    @property
    def members_pks(self):
        participant_pks = self.participants.values_list('pk', flat=True)
        all_user_ids = set(participant_pks) | {self.creator_id} - {None}
        return all_user_ids
