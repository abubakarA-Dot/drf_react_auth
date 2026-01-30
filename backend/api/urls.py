from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import AuthenticationViewSet, CookieTokenRefreshView, LogoutView, ProfileViewSet, RegisterViewSet, UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

users_router = routers.NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'profile', ProfileViewSet, basename='user-profile')

urlpatterns = [
    path('login', AuthenticationViewSet.as_view(), name='token_obtain_pair'),
    path('logout', LogoutView.as_view(), name='token_logout'),
    path('login/refresh', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterViewSet.as_view({'post': 'create'}), name="sign_up"),
    path('', include(router.urls)),
    path('', include(users_router.urls)),
]
