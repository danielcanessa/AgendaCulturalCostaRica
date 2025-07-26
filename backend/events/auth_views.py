from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import (
    IsAuthenticated
)
from rest_framework_simplejwt.tokens import (
    RefreshToken, 
    TokenError
)

from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    EmailTokenObtainPairSerializer,
    UserSerializer,
    ChangePasswordSerializer
)

class EmailTokenObtainPairView(APIView):
    """
    Custom JWT view to authenticate users using email and password.
    Uses EmailTokenObtainPairSerializer to generate JWT tokens.
    """
    def post(self, request, *args, **kwargs):
        serializer = EmailTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
class RegisterAPIView(APIView):
    """
    Endpoint for user registration.
    Receives required user fields and creates a new user account.
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Create the user
            serializer.save()
            data = serializer.data          
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutAPIView(APIView):
    """
    Logout endpoint for JWT authentication.
    Blacklists the refresh token, so it can no longer be used to obtain a new access token.
    The user must be authenticated (must send a valid refresh token).
    """
    permission_classes = []

    def post(self, request):
        """
        Expects 'refresh' in the request body.
        """
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            # Blacklist the token so it can't be used anymore
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        
class MeAPIView(APIView):
    """
    Endpoint to retrieve the authenticated user's own profile.
    Requires a valid JWT access token.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ChangePasswordAPIView(APIView):
    """
    Endpoint for authenticated users to change their password.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not check_password(old_password, user.password):
                return Response({'old_password': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)