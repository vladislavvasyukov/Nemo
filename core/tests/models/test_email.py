import pytest
from django.core.files.base import ContentFile
from django.template.loader import render_to_string

from core.models import Email


@pytest.mark.django_db
class TestEmail:
    pytestmark = pytest.mark.django_db

    def test_create_from_tpl(self):
        template_name = 'core/emails/test.html'
        context = {"counter": 1}
        prefix = 'test '
        subject = "test message"
        attachments = [
            ContentFile(b"content", name="test.txt"),
            ContentFile(b"content", name="test1.txt")
        ]

        to = ['test@test.ru']
        cc = ['test@test.ru']
        bcc = ['test@test.ru']

        email = Email.objects.create_from_tpl(
            template_name=template_name,
            to=to,
            cc=cc,
            bcc=bcc,
            context=context,
            prefix=prefix,
            subject=subject,
            attachments=attachments
        )

        assert email.subject == "%s%s" % (prefix, subject)
        assert email.to == to
        assert email.cc == cc
        assert email.bcc == bcc
        assert email.attachments.count() == len(attachments)
        assert email.body == render_to_string(template_name, context)
