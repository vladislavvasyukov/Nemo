import pytest
from django.urls import reverse

from core.models import Email
from core.tests.factories import UserFactory


@pytest.mark.django_db
class TestRecoverPassword:
    """
    Класс для тестирования создания письма для восстановления пароля
    """
    pytestmark = pytest.mark.django_db

    def test_recover_password_one(self, mocker, client) -> None:
        """
        Тест неудачного создания письма (в базе отсутствует пользователь с таким email)
        """

        data = {
            'email': 'test@gmail.com',
        }
        response = client.post(reverse('recover-password'), data=data)
        assert response.status_code == 200

        email = Email.objects.first()
        assert email is None

    def test_recover_password_two(self, mocker, client) -> None:
        """
        Тест удачного создания письма
        """

        user1 = UserFactory()

        data = {
            'email': user1.email,
        }
        response = client.post(reverse('recover-password'), data=data)
        assert response.status_code == 200

        email = Email.objects.first()
        assert email is not None
