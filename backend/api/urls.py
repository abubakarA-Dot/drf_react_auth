from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AuthenticationViewSet, RegisterViewSet)

# router = DefaultRouter()
# router.register(r'auth', LoginViewSet, basename='auth')

urlpatterns = [
    path('login/', AuthenticationViewSet.as_view(), name="login"),
    path('register/', RegisterViewSet.as_view({'post': 'create'}), name="register"),
]