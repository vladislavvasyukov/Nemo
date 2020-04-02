from django import forms
from django.contrib.auth.forms import PasswordResetForm
from django.utils.translation import ugettext_lazy as _

from core.models import User, Email


class PasswordRecoveryForm(PasswordResetForm):

    email = forms.EmailField(
        label="Email"
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        try:
            User.objects.get(email__iexact=email, is_active=True)
        except User.DoesNotExist:
            raise forms.ValidationError(_("Извините, пользователь с указанным email-ом не обнаружен."))
        return email

    def send_mail(self, *args, **kwargs):
        context = args[2]
        Email.objects.create_from_tpl(
            "core/emails/password_recover.html",
            context,
            _('Запрос на восстановление пароля'),
            [self.cleaned_data.get('email')]
        )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
