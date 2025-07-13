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
import os

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

    def perform_destroy(self, instance):
        """
        Delete associated image file on disk when deleting Category instance.
        """
        if instance.image_path and os.path.exists(instance.image_path):
            os.remove(instance.image_path)
        instance.delete()

class EventViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Event."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_destroy(self, instance):
        """
        Delete associated banner image file on disk when deleting Event instance.
        """
        if instance.event_banner_path and os.path.exists(instance.event_banner_path):
            os.remove(instance.event_banner_path)
        instance.delete()

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

    def perform_destroy(self, instance):
        """
        Delete associated image file on disk when deleting Comment instance.
        """
        if instance.image_path and os.path.exists(instance.image_path):
            os.remove(instance.image_path)
        instance.delete()