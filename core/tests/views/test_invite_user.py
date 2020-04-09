import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, CompanyFactory


@pytest.mark.django_db
def test_invite_user(client):
    """
    Тест приглашения пользователя
    """

    company = CompanyFactory()
    user_one = UserFactory(companies=[company])
    token = AuthToken.objects.create(user_one)[1]

    user_two = UserFactory()

    data = {
        'email': user_two.email
    }

    session = client.session
    session['current_company_id'] = company.pk
    session.save()

    response = client.post(reverse('invite-user'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert user_two.companies.filter(pk=company.pk).exists()
