from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cart, name='get_cart'),
    path('add/', views.add_to_cart, name='add_to_cart'),
    path('remove/<str:product_name>/', views.remove_from_cart, name='remove_from_cart'),
    path('update/<str:product_name>/', views.update_cart_item, name='update_cart_item'),
    path('clear/', views.clear_cart, name='clear_cart'),
]
