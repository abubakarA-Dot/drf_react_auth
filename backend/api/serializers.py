from rest_framework.serializers import Serializer, CharField, ModelSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import (
    get_user_model,
    authenticate,
)

from .models import User

class LoginSerializer(Serializer):
    email = CharField()
    password = CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password']
    
    def create(self, request, *args, **kwargs):
        return get_user_model().objects.create(**request.data)

class RegisterSerializer(ModelSerializer):
    """Serializer for user object"""
    
    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'name']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}
    
    def create(self, validated_data):
        user = get_user_model().objects.create(**validated_data)
        password = user.password
        if password:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user


class UserSerializer(ModelSerializer):
    """Serializer for user object"""
    
    class Meta:
        model = get_user_model()
        exclude = ['groups', 'user_permissions']
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True},
        }


class UserUpdateSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'name', 'company']
    