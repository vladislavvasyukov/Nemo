import factory.fuzzy

from core.models import Task
from core.tests.factories import UserFactory, ProjectFactory


class TaskFactory(factory.DjangoModelFactory):
    title = factory.Sequence(lambda x: "title%s" % x)
    description = factory.fuzzy.FuzzyText(length=256)
    status = factory.fuzzy.FuzzyChoice(list(Task.Status.values.keys()))
    executor = factory.SubFactory(UserFactory)
    manager = factory.SubFactory(UserFactory)
    author = factory.SubFactory(UserFactory)
    project = factory.SubFactory(ProjectFactory)

    class Meta:
        model = Task
