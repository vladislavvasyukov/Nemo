from django.conf import settings
from django.db import transaction
from django.template.loader import render_to_string

from core.managers.base import BaseManager
from core.utils import get_site_main_page


class EmailManager(BaseManager):

    def create_from_tpl(self, template_name, context, subject, to, **kwargs):
        context.update({
            'SITE_DISPLAY_NAME': settings.SITE_DISPLAY_NAME,
            'SITE_MAIN_PAGE': get_site_main_page(),
        })
        content = render_to_string(template_name, context)
        return self.create_from_string(content, subject, to, **kwargs)

    def create_from_string(self, content, subject, to, **kwargs):
        sender = kwargs.get('sender', settings.EMAIL_HOST_USER)
        subject_prefix = kwargs.get("prefix", getattr(settings, "EMAIL_SUBJECT_PREFIX", ""))
        cc = kwargs.get('cc')
        bcc = kwargs.get('bcc')
        attachments = kwargs.get('attachments', [])

        with transaction.atomic():
            email = self.create(
                body=content,
                sender=sender,
                to=to,
                cc=cc,
                bcc=bcc,
                subject="%s%s" % (subject_prefix, subject)
            )

            for attachment in attachments:
                email.attachments.create(
                    file=attachment,
                    filename=attachment.name
                )

        return email
