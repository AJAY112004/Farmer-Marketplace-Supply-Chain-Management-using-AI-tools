from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'seller', 'rating']
    list_filter = ['category', 'seller']
    search_fields = ['name', 'description', 'seller']
