from django.urls import path
from .views import RegisterView, LoginView, ProfileView, change_password

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', change_password, name='change_password'),
]
