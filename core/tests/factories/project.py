import factory.fuzzy

from core.models import Project


class ProjectFactory(factory.DjangoModelFactory):
    name = factory.Sequence(lambda x: "NAME%s" % x)

    class Meta:
        model = Project
