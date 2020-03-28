import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory


@pytest.mark.django_db
def test_save_profile(client):
    """
    Тест сохранения пользовательского профиля
    """

    user = UserFactory()
    token = AuthToken.objects.create(user)[1]

    data = {
        'telegram': '@test-test',
        'skype': 'live:test',
        'name': user.name,
        'email': user.email,
    }
    response = client.post(
        reverse('save-profile', args=(user.pk, )),
        data=data,
        HTTP_AUTHORIZATION=f'Token {token}',
    )

    user.refresh_from_db()

    assert response.status_code == 200
    assert user.telegram == data['telegram']
    assert user.skype == data['skype']
