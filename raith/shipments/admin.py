from django.contrib import admin
from .models import Shipment

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'status', 'sender_name', 'receiver_name', 'created_at')
    search_fields = ('tracking_number', 'sender_name', 'receiver_name', 'status')
