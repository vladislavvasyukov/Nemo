import pytest
from django.urls import reverse

from core.tests.factories import UserFactory


@pytest.mark.django_db
def test_registration(client):
    """
    Тест регистрации пользователя
    """

    data = {
        "name": "user1",
        "email": "temp@yandex.ru",
        "password": "hunter2",
    }

    response = client.post(reverse('register'), data=data)
    assert response.status_code == 200


@pytest.mark.django_db
def test_login(client):
    """
    Тест аутентификации пользователя
    """

    data = {
        'email': 'temp@yandex.ru',
        'password': '1234',
    }
    UserFactory(email=data['email'], password=data['password'])
    response = client.post(reverse('login'), data=data)
    assert response.status_code == 200
