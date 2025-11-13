from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse(b"Welcome to AgroConnect!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/shipments/', include('shipments.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/auth/', include('users.urls')),
    path('', home, name='home'),
]
