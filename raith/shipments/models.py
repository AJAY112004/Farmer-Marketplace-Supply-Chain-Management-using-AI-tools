from django.db import models

class Shipment(models.Model):
    tracking_number = models.CharField(max_length=100, unique=True)
    product_type = models.CharField(max_length=100)
    weight_kg = models.FloatField()
    quantity = models.IntegerField(default=1)
    distance_km = models.FloatField(null=True, blank=True)
    total_cost = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, default='booked')  # booked, in_transit, delivered

    sender_name = models.CharField(max_length=100)
    sender_phone = models.CharField(max_length=20)
    sender_address = models.TextField()

    receiver_name = models.CharField(max_length=100)
    receiver_phone = models.CharField(max_length=20)
    receiver_address = models.TextField()

    scheduled_pickup = models.DateTimeField(null=True, blank=True)
    actual_pickup = models.DateTimeField(null=True, blank=True)
    scheduled_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)

    driver_name = models.CharField(max_length=100, null=True, blank=True)
    driver_phone = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tracking_number} - {self.status}"
