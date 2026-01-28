from rest_framework.serializers import Serializer, CharField
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import User

class AuthenticationSerializer(Serializer):
    email = CharField()
    password = CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password']