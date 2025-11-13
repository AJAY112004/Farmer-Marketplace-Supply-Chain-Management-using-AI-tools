from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_shipments, name='list_shipments'),
    path('create/', views.create_shipment, name='create_shipment'),
    path('track/<str:tracking_number>/', views.track_shipment, name='track_shipment'),
    path('update-status/<str:tracking_number>/', views.update_shipment_status, name='update_status'),
]
