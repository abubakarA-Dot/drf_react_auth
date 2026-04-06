from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.conf import settings

from api.common import UserRole
from api.permissions import Permission


class UserManager(BaseUserManager):
    """Manager for Users"""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user"""
        if not email:
            raise ValueError("User must have an Email")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create, save and return a new super user"""
        user = self.create_user(email, password)
        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=5, choices=UserRole.choices, default='RD')
    permissions = models.OneToOneField(Permission, related_name='permissions', on_delete=models.CASCADE, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurants')
    restaurant_number = models.CharField(max_length=20, unique=True)
    tax_number = models.CharField(max_length=20, unique=True)
    

class ConnectedRestaurantUser(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=5, choices=UserRole.choices, default='RD')
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='restaurant_users')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurant_members', null=True)
    permissions = models.OneToOneField(Permission, related_name='user_permissions', on_delete=models.CASCADE, null=True)
    
    @property
    def user_perms(self):
        return self.permissions.for_user()

    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'
