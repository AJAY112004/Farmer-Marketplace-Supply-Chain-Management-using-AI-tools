from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'price', 'quantity', 'weight_kg', 'distance_km', 'total_cost']
        read_only_fields = ['id', 'total_cost']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'updated_at', 'total_items', 'total_cost']
        read_only_fields = ['id', 'user', 'total_items', 'total_cost', 'updated_at']
