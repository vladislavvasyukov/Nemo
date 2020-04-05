import time
import traceback

from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from django.utils.html import strip_tags

from core.management.commands import CoreCommandLocked
from core.models import Email


class Command(CoreCommandLocked):
    help = """
        Отправка писем из модели core.Email
    """

    CHUNK_SIZE = 10

    def run(self, *args, **options):

        self.logger.info('Start serve emails')

        emails = Email.objects.filter(
            sent_date__isnull=True
        ).prefetch_related("attachments").order_by('created')[0:self.CHUNK_SIZE]

        if emails.count() > 0:
            for email in emails:
                self._send_email(email)

    def _send_email(self, email):
        self.logger.info('Send {} "{}" to="{}" ...'.format(email.id, email.subject, ",".join(email.to)))
        try:
            text_content = strip_tags(email.body)

            msg = EmailMultiAlternatives(
                email.subject,
                text_content,
                email.sender,
                email.to,
                cc=email.cc,
                bcc=email.bcc
            )
            msg.attach_alternative(email.body, "text/html")
            for attachment in email.attachments.all():
                msg.attach_file(attachment.file.path)

            msg.send()
            email.sent_date = timezone.now()
            self.logger.info('OK')
        except Exception:
            tb = traceback.format_exc()
            email.error = tb
            self.logger.exception('send {} error'.format(email.id))
        email.save()
