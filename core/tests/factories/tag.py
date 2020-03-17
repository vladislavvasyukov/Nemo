import factory.fuzzy

from core.models import Tag


class TagFactory(factory.DjangoModelFactory):
    title = factory.Sequence(lambda x: "title%s" % x)

    class Meta:
        model = Tag
