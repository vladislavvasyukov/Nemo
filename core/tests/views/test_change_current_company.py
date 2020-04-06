import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
def test_change_current_company(client):
    """
    Тест изменения текущей компании
    """

    user = UserFactory()
    token = AuthToken.objects.create(user)[1]
    company_id = user.companies.first().pk

    data = {
        'company_id': company_id,
    }
    response = client.post(reverse('change_current_company'), data=data, HTTP_AUTHORIZATION=f'Token {token}')
    assert response.status_code == 200
