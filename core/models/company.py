from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Company(TimeStampedModel):
    name = models.CharField(max_length=255, verbose_name='Название')
    creator = models.ForeignKey('core.User', models.CASCADE, verbose_name=_('Сотрудник'), null=True, blank=True)

    class Meta:
        verbose_name = _('Компания')
        verbose_name_plural = _('Компании')

    def __str__(self):
        return self.name


class CompanyUser(TimeStampedModel):
    user = models.ForeignKey('core.User', models.CASCADE, verbose_name=_('Сотрудник'), db_index=False)
    company = models.ForeignKey('core.Company', models.CASCADE, verbose_name=_('Компания'),  db_index=False)
    is_admin = models.BooleanField(_('Администратор'), default=False)

    class Meta:
        verbose_name = _('Сотрудник компании')
        verbose_name_plural = _('Сотрудники компаний')
        constraints = (
            models.UniqueConstraint(fields=['user', 'company'], name='unique_company_user'),
        )
