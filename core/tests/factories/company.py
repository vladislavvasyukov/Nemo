import factory.fuzzy

from core.models import Company


class CompanyFactory(factory.DjangoModelFactory):
    name = factory.Sequence(lambda x: "NAME%s" % x)

    class Meta:
        model = Company
