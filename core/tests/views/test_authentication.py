import pytest
from django.conf import settings


@pytest.mark.django_db
def test_registration(client):
    """
    Тест регистрации пользователя
    """

    data = {
        "username": "user1",
        "password": "hunter2"
    }

    response = client.post(f'{settings.SITE_PROTOCOL}://{settings.SITE_DOMAIN}/api/auth/register/', data=data)
