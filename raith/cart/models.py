from django.conf import settings
from django.db import models


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart'
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    @property
    def total_items(self):
        return self.items.aggregate(models.Sum('quantity'))['quantity__sum'] or 0

    @property
    def total_cost(self):
        return self.items.aggregate(models.Sum('total_cost'))['total_cost__sum'] or 0.0

    def calculate_item_cost(self, price, quantity, weight_kg=None, distance_km=None):
        base_cost = price * quantity
        shipping_cost = 0.0
        if weight_kg and distance_km:
            shipping_cost = 0.05 * weight_kg * distance_km
        return base_cost + shipping_cost


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=255)
    price = models.FloatField()
    quantity = models.PositiveIntegerField(default=1)
    weight_kg = models.FloatField(null=True, blank=True)
    distance_km = models.FloatField(null=True, blank=True)
    total_cost = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
