from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet

# router = DefaultRouter()
# router.register(r'auth', LoginViewSet, basename='auth')

urlpatterns = [
    path('login/', LoginViewSet.as_view(), name="login"),
]