"""
ViewSets for the events app.
Each ViewSet provides the API endpoints (CRUD) for its model.
"""

from rest_framework import viewsets
from .models import (
    Currency, UserRole, Organization, User, Category, Event,
    UserEvent, AccessibilityFeature, EventAccessibilityFeature, Comment
)
from .serializers import (
    CurrencySerializer, UserRoleSerializer, OrganizationSerializer, UserSerializer,
    CategorySerializer, EventSerializer, UserEventSerializer,
    AccessibilityFeatureSerializer, EventAccessibilityFeatureSerializer, CommentSerializer
)

# Each viewset below exposes the CRUD API endpoints for its corresponding model

class CurrencyViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Currency."""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

class UserRoleViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing UserRole."""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Organization."""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing User."""
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Category."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class EventViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Event."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class UserEventViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing UserEvent."""
    queryset = UserEvent.objects.all()
    serializer_class = UserEventSerializer

class AccessibilityFeatureViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing AccessibilityFeature."""
    queryset = AccessibilityFeature.objects.all()
    serializer_class = AccessibilityFeatureSerializer

class EventAccessibilityFeatureViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing EventAccessibilityFeature."""
    queryset = EventAccessibilityFeature.objects.all()
    serializer_class = EventAccessibilityFeatureSerializer

class CommentViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Comment."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer