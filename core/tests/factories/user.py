import factory.fuzzy

from core.models import User


class UserFactory(factory.DjangoModelFactory):
    email = factory.Sequence(lambda x: f'login{x}@mail.ru')
    password = factory.PostGenerationMethodCall('set_password', 'test')

    is_staff = False
    is_active = True
    avatar = None

    class Meta:
        model = User
