from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_order, name='create_order'),  # POST to create
    path('list/', views.list_orders, name='list_orders'),  # GET to list
    path('<int:order_id>/', views.get_order, name='get_order'),  # GET specific order
]
