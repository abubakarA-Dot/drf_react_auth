from datetime import date
from tokenize import TokenError
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
    RegisterSerializer, LoginSerializer, RestaurantUserSerializer, UserSerializer, UserUpdateSerializer, RestaurantSerializer
    )
from .models import ConnectedRestaurantUser, Restaurant, User

from django.contrib.auth import login


class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token
        except Exception:
            return Response({"detail": "Refresh token expired"}, status=401)

        response = Response({"access": str(access)})
        response.set_cookie(
            "access_token",
            str(access),
            httponly=True,
            secure=False,
            samesite="Strict",
            max_age=60 * 15,
        )
        return response

class AuthenticationViewSet(APIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        logged_in_user = request.user
        if logged_in_user and logged_in_user.is_authenticated:
            return Response({'detail': "User already logged in"}, status=status.HTTP_200_OK)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            refresh_token = RefreshToken.for_user(user)
            result = {
                'refresh_token': str(refresh_token),
                'access_token': str(refresh_token.access_token)
            }
            login(request, user)
            response = Response(result, status=status.HTTP_200_OK)
            response.set_cookie(
                key="access_token",
                value=result.get("access_token"),
                httponly=True,
                secure=False,
                samesite='Strict',
                max_age=60 * 15,

            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Strict',
                max_age=60 * 60 * 24 * 7,
            )
            
            user.last_login = date.today()
            user.save()
            return response
        return Response({'error': "Username or password incorrect"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        # Blacklist the refresh token
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass
        
        response = Response({"detail": "Logged out successfully"}, status=200)

        response.delete_cookie('access_token', samesite='Strict')
        response.delete_cookie('refresh_token', samesite='Strict')
        
        return response  

class RegisterViewSet(CreateModelMixin, GenericViewSet):
    serializer_class = RegisterSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes=[IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request and self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer
    
    # def update(self, request, *args, **kwargs): in future, we can add this method to make sure that users can only update their own profile. 
    #     instance = self.get_object()
    #     if instance.pk != request.user.pk:
    #         return Response({"detail": "You can only update your own profile"}, status=status.HTTP_403_FORBIDDEN)
    #     return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ProfileViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.__class__.objects.filter(pk=self.request.user.pk)


class RestaurantViewSet(ModelViewSet):
    queryset = Restaurant.objects.select_related('owner')
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return self.request.user.__class__.objects.filter(pk=self.request.user.pk)
class RestaurantUserViewSet(ModelViewSet):
    queryset = ConnectedRestaurantUser.objects.select_related('user', 'restaurant', 'permissions')
    serializer_class = RestaurantUserSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return self.request.user.__class__.objects.filter(pk=self.request.user.pk)
