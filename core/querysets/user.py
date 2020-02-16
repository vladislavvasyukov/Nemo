from core.querysets.base import BaseQuerySet


class UserQuerySet(BaseQuerySet):
    def active(self):
        return self.filter(is_active=True)
