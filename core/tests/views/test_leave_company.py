import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, CompanyFactory


@pytest.mark.django_db
def test_leave_company(client):
    """
    Тест выхода из компании
    """

    company_one = CompanyFactory()
    company_two = CompanyFactory()
    user = UserFactory(companies=[company_one, company_two])
    token = AuthToken.objects.create(user)[1]

    data = {
        'company_id': company_two.pk
    }
    response = client.post(reverse('leave_company'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert not user.companies.filter(pk=company_two.pk).exists()
