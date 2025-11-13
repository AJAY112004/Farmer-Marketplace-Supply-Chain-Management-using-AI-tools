from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status


class CartTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(
            email='ajay@example.com',
            full_name='Ajay H M',
            password='test123'
        )


        self.client.force_authenticate(user=self.user)  # <-- Use this instead of .login() for DRF views

    def test_add_and_remove_item(self):
        # --- Add item ---
        add_url = '/api/cart/add/'
        add_payload = {
            "product_name": "Fertilizer",
            "price": 500,
            "quantity": 2
        }

        response = self.client.post(add_url, add_payload, format='json')
        self.assertIn(
            response.status_code,
            [200, 201],
            msg=f"Unexpected status: {response.status_code}, data: {response.data if hasattr(response, 'data') else response.content}"
        )
        self.assertTrue(
            'Fertilizer' in str(response.data) or 'items' in response.data,
            msg=f"Unexpected response data: {response.data}"
        )

        # --- Remove item ---
        remove_url = '/api/cart/remove/Fertilizer/'
        response = self.client.delete(remove_url)
        self.assertIn(
            response.status_code,
            [200, 204],
            msg=f"Unexpected status: {response.status_code}"
        )
