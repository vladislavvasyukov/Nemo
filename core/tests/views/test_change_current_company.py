import pytest
from django.urls import reverse
from knox.models import AuthToken
import json
from core.tests.factories import UserFactory, CompanyFactory


@pytest.mark.django_db
def test_change_current_company(client):
    """
    Тест изменения текущей компании
    """

    company = CompanyFactory()
    user = UserFactory(companies=[company, ])
    token = AuthToken.objects.create(user)[1]

    data = {
        'current_company_id': company.pk,
    }
    response = client.post(reverse('change_current_company'), data=data, HTTP_AUTHORIZATION=f'Token {token}')
    assert response.status_code == 200
    assert json.loads(response.content)['success']
