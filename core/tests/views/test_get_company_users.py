import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, CompanyFactory


@pytest.mark.django_db
def test_get_company_users(client):
    """
    Тест получения списка сотрудников компании
    """

    company = CompanyFactory()
    user1 = UserFactory(companies=[company])
    user2 = UserFactory(companies=[company])
    token = AuthToken.objects.create(user1)[1]

    session = client.session
    session['current_company_id'] = company.pk
    session.save()

    response = client.get(reverse('get_company_users'), HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert len(response.data) == 2
