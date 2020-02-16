import os
from datetime import date

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel

from core.managers import EmailManager
from core.utils import get_uniq_filename


class Email(TimeStampedModel):

    body = models.TextField(verbose_name=_("Тело письма"))
    subject = models.CharField(verbose_name=_("Тема письма"), max_length=254)
    sender = models.EmailField(verbose_name=_("От кого"))
    to = ArrayField(models.EmailField(), verbose_name=_("Кому"))
    cc = ArrayField(models.EmailField(), verbose_name=_("Копия"), null=True, blank=True)
    bcc = ArrayField(models.EmailField(), verbose_name=_("Скрытая копия"), null=True, blank=True)
    sent_date = models.DateTimeField(verbose_name=_("Дата отправки"), null=True, blank=True)
    error = models.TextField(verbose_name=_("Ошибка"), null=True)

    objects = EmailManager()

    class Meta:
        verbose_name = _('Письмо')
        verbose_name_plural = _('Письма')
        db_table = "emails"

    @property
    def is_sent(self):
        return bool(self.sent_date)


def email_attachments_upload_to(instance, filename):
    today = date.today()
    return os.path.join("email_attachments", str(today.year), str(today.month), str(today.day), get_uniq_filename(filename))


class EmailAttachment(TimeStampedModel):
    email = models.ForeignKey(Email, verbose_name=_("Email"), related_name="attachments", on_delete=models.CASCADE)
    file = models.FileField(upload_to=email_attachments_upload_to)
    filename = models.CharField(_("Название файла"), max_length=254)

    class Meta:
        db_table = "email_attachments"
