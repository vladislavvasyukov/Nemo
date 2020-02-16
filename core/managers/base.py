from django.db.models import Manager

from core.querysets.base import BaseQuerySet


class BaseManager(Manager):

    queryset_class = BaseQuerySet

    def get_queryset(self):
        return self.queryset_class(self.model, using=self._db)
