import factory.fuzzy

from core.models import User


class UserFactory(factory.DjangoModelFactory):
    email = factory.Sequence(lambda x: f'login{x}@mail.ru')
    password = factory.PostGenerationMethodCall('set_password', 'test')
    name = factory.Sequence(lambda n: f'name{n}')

    is_staff = False
    is_active = True
    avatar = None

    class Meta:
        model = User

    @factory.post_generation
    def companies(self, create, extracted):
        if not create:
            return

        if extracted:
            for i in extracted:
                self.companies.add(i)
