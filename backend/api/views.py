from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (RegisterSerializer, LoginSerializer)

class AuthenticationViewSet(APIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
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
            return Response(result, status=status.HTTP_200_OK)
        return Response({'error': "Username or password incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        

class RegisterViewSet(CreateModelMixin, GenericViewSet):
    serializer_class = RegisterSerializer
