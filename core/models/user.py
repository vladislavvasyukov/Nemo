from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from core.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    USERNAME_FIELD = 'email'

    name = models.CharField(_('имя'), max_length=64)
    email = models.EmailField('Email', blank=False, unique=True)
    telegram = models.CharField(_('Telegram'), max_length=255, blank=True, null=True)
    skype = models.CharField(_('Skype'), max_length=255, blank=True, null=True)

    is_staff = models.BooleanField(_('Персонал'), default=False)
    is_active = models.BooleanField(_('Активный'), default=True)
    date_joined = models.DateTimeField(_('Дата регистрации'), default=timezone.now)

    avatar = models.ImageField(verbose_name=_('Аватар'), upload_to='avatar', blank=True, null=True)

    companies = models.ManyToManyField(
        'core.Company', 
        related_name='users', 
        verbose_name=_('Компании'), 
        through='core.CompanyUser',
    )

    objects = UserManager()

    class Meta(AbstractBaseUser.Meta):
        verbose_name = _('Сотрудник')
        verbose_name_plural = _('Сотрудники')

    @property
    def avatar_url(self):
        return self.avatar.url if self.avatar else settings.DEFAULT_AVATAR_URL
