import factory.fuzzy

from core.models import Notification
from core.tests.factories import UserFactory, CommentFactory


class NotificationFactory(factory.DjangoModelFactory):
    
    user = factory.SubFactory(UserFactory)
    comment = factory.SubFactory(CommentFactory)


    class Meta:
        model = Notification
