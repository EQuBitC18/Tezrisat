from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Payment


class PaymentListViewTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="pw")
        self.user2 = User.objects.create_user(username="user2", password="pw")
        Payment.objects.create(user=self.user1, amount=1000, currency="usd", email="u1@example.com")
        Payment.objects.create(user=self.user2, amount=2000, currency="usd", email="u2@example.com")

    def test_list_only_user_payments(self):
        self.client.login(username="user1", password="pw")
        resp = self.client.get(reverse("payment-list"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.json()), 1)
