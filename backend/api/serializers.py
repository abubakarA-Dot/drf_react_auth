from rest_framework.serializers import Serializer, CharField, ModelSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import (
    get_user_model,
    authenticate,
)

from api.permissions import Permission

from .models import ConnectedRestaurantUser, Restaurant, User

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



class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class UserSerializer(ModelSerializer):
    """Serializer for user object"""
    permissions = PermissionSerializer()
    
    class Meta:
        model = get_user_model()
        exclude = ['groups', 'user_permissions']
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True},
        }


class UserUpdateSerializer(ModelSerializer):
    permissions = PermissionSerializer()
    class Meta:
        model = get_user_model()
        fields = ['email', 'name', 'company', 'role', 'permissions']

    def update(self, instance, validated_data):
        permissions = validated_data.get('permissions', {})
        permission = Permission.objects.get(id=permissions)
        instance.permissions = permission
        instance.save()
        return instance


class RestaurantSerializer(ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class RestaurantUserSerializer(ModelSerializer):
    class Meta:
        model = ConnectedRestaurantUser
        fields = ['id', 'email', 'name', 'first_name', 'last_name', 'role', 'user_perms', 'restaurant', 'is_active']
    
    def create(self, validated_data):
        permissions = validated_data.get('permissions', {})
        user, created = User.objects.get_or_create(
            email = validated_data.get("email"),
            is_active = False,
        )
        perm_obj = Permission.objects.create(**permissions)
        restaurant_user = ConnectedRestaurantUser.objects.create(
            user=user,
            permissions=perm_obj,
            role = validated_data.get("role", "RD"),
            restaurant=validated_data.get("restaurant"),
            is_active=False
        )
        # send email invitation now.
        return restaurant_user

    def update(self, instance, validated_data):
        permissions = validated_data.get('permissions', {})
        instance.role = validated_data.get("role", "RD")
        instance.email = validated_data.get("email", "")
        instance.first_name = validated_data.get("first_name", "")
        instance.last_name = validated_data.get("last_name", "")
        instance.save()
        perm_obj = instance.user_perms
        for key, val in permissions.items():
            setattr(perm_obj, key, val)
        if perm_obj:
            perm_obj.save()
        return instance
    