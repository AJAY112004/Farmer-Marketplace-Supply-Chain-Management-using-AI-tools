from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_products, name='list_products'),
    path('<int:product_id>/', views.get_product, name='get_product'),
    path('create/', views.create_product, name='create_product'),
    path('<int:product_id>/update/', views.update_product, name='update_product'),
    path('<int:product_id>/delete/', views.delete_product, name='delete_product'),
]
