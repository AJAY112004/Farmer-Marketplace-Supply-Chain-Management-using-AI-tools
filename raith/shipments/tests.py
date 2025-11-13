from django.test import TestCase
from rest_framework.test import APIClient
from .models import Shipment

class ShipmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_and_track_shipment(self):
        response = self.client.post('/api/shipments/create/', {
            "product_type": "Fertilizer",
            "weight_kg": 20,
            "quantity": 5,
            "sender_name": "Ajay",
            "sender_phone": "9876543210",
            "sender_address": "Bangalore",
            "receiver_name": "Ravi",
            "receiver_phone": "9876500000",
            "receiver_address": "Mysore"
        }, format='json')
        self.assertEqual(response.status_code, 201)
        tracking_number = response.data['tracking_number']

        track_resp = self.client.get(f'/api/shipments/track/{tracking_number}/')
        self.assertEqual(track_resp.status_code, 200)
