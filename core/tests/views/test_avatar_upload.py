import os

import pytest
from django.conf import settings
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory


@pytest.mark.django_db
def test_avatar_upload(client):
    """
    Тест загрузки аватарки
    """

    user = UserFactory()
    token = AuthToken.objects.create(user)[1]

    path = os.path.join(settings.BASE_DIR, 'core', 'tests', 'fixtures', "test_avatar.png")
    data = {
        'pk': user.pk,
        'file': open(path, 'rb'),
    }
    response = client.post(reverse('avatar-upload'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    user.refresh_from_db()

    assert user.avatar is not None
    assert response.status_code == 200
