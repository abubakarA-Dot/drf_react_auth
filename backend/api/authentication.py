# authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token_str = request.COOKIES.get('refresh_token')
        
        if not access_token and not refresh_token_str:
            return None
        
        # Try access token first
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except Exception:
                pass # pass because access token expired and now refresh it below
        
        # Try refresh token
        if refresh_token_str:
            try:
                refresh = RefreshToken(refresh_token_str)

                new_access_token = str(refresh.access_token)
 
                if hasattr(refresh, 'access_token'):
                    # Blacklist old refresh token
                    refresh.blacklist()
                    new_refresh = RefreshToken.for_user(self.get_user(self.get_validated_token(new_access_token)))
                    new_refresh_token = str(new_refresh)
                else:
                    new_refresh_token = refresh_token_str
                
                validated_token = self.get_validated_token(new_access_token)
                user = self.get_user(validated_token)
                
                # Store both new tokens to access in custom middleware
                request._new_access_token = new_access_token
                request._new_refresh_token = new_refresh_token
                
                return (user, validated_token)
            except TokenError as e:
                print(f"Refresh token error: {e}")
                return None
            except Exception as e:
                print(f"Unexpected error during token refresh: {e}")
                return None
        
        return None