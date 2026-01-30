class RefreshTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if hasattr(request, '_new_access_token'): # coming from CookieJWTAuthentication
            response.set_cookie(
                key="access_token",
                value=request._new_access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60 * 15,
            )
        
        if hasattr(request, '_new_refresh_token'):
            response.set_cookie(
                key="refresh_token",
                value=request._new_refresh_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60 * 60 * 24 * 7,
            )
        
        return response