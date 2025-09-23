from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
import jwt
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def debug_token(request):
    """Debug endpoint to test JWT token validation"""
    try:
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        debug_info = {
            'auth_header_received': bool(auth_header),
            'auth_header_format': auth_header[:50] + '...' if auth_header else 'No Authorization header',
            'request_headers': {
                key: value for key, value in request.META.items()
                if key.startswith('HTTP_') and 'AUTH' in key
            },
            'jwt_secret_key_configured': bool(getattr(settings, 'SECRET_KEY', None)),
            'simple_jwt_settings': getattr(settings, 'SIMPLE_JWT', {}),
        }

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            debug_info['token_extracted'] = True
            debug_info['token_preview'] = token[:30] + '...'

            try:
                # Try to decode the token manually
                decoded = jwt.decode(
                    token,
                    settings.SECRET_KEY,
                    algorithms=['HS256']
                )
                debug_info['token_valid'] = True
                debug_info['token_payload'] = decoded

            except jwt.ExpiredSignatureError:
                debug_info['token_valid'] = False
                debug_info['token_error'] = 'Token expired'
            except jwt.InvalidTokenError as e:
                debug_info['token_valid'] = False
                debug_info['token_error'] = str(e)
        else:
            debug_info['token_extracted'] = False

        return Response({
            'message': 'Debug information gathered',
            'debug_info': debug_info
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in debug_token: {e}")
        return Response({
            'error': str(e),
            'debug_info': debug_info if 'debug_info' in locals() else {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_authenticated(request):
    """Debug endpoint that requires authentication"""
    return Response({
        'message': 'Authentication successful!',
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        },
        'auth_method': str(request.auth) if hasattr(request, 'auth') else 'Unknown'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_jwt_settings(request):
    """Debug endpoint to check JWT configuration"""
    return Response({
        'jwt_settings': {
            'ACCESS_TOKEN_LIFETIME': str(settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME')),
            'REFRESH_TOKEN_LIFETIME': str(settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME')),
            'ALGORITHM': settings.SIMPLE_JWT.get('ALGORITHM'),
            'SIGNING_KEY_CONFIGURED': bool(settings.SIMPLE_JWT.get('SIGNING_KEY')),
        },
        'secret_key_configured': bool(settings.SECRET_KEY),
        'debug_mode': settings.DEBUG,
    }, status=status.HTTP_200_OK)