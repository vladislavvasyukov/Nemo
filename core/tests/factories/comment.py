import factory.fuzzy

from dateutil.relativedelta import relativedelta
from django.utils import timezone

from core.models import Comment
from core.tests.factories import UserFactory, TaskFactory


class CommentFactory(factory.DjangoModelFactory):
    
    text = factory.fuzzy.FuzzyText(length=256)
    timestamp = factory.fuzzy.FuzzyDateTime(
        start_dt=timezone.now() - relativedelta(days=30),
        end_dt=timezone.now()
    )
    user = factory.SubFactory(UserFactory)
    task = factory.SubFactory(TaskFactory)


    class Meta:
        model = Comment
