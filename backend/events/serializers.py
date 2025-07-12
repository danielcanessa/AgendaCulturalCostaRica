"""
Serializers for the events app.
Serializers convert model instances to JSON for the API and validate input data.
"""

from rest_framework import serializers
from .models import (
    Currency, UserRole, Organization, User, Category, Event,
    UserEvent, AccessibilityFeature, EventAccessibilityFeature, Comment
)

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for Currency model."""
    class Meta:
        model = Currency
        fields = '__all__'

class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer for UserRole model."""
    class Meta:
        model = UserRole
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model."""
    class Meta:
        model = Organization
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    class Meta:
        model = Category
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model."""
    class Meta:
        model = Event
        fields = '__all__'

class UserEventSerializer(serializers.ModelSerializer):
    """Serializer for UserEvent model."""
    class Meta:
        model = UserEvent
        fields = '__all__'

class AccessibilityFeatureSerializer(serializers.ModelSerializer):
    """Serializer for AccessibilityFeature model."""
    class Meta:
        model = AccessibilityFeature
        fields = '__all__'

class EventAccessibilityFeatureSerializer(serializers.ModelSerializer):
    """Serializer for EventAccessibilityFeature model."""
    class Meta:
        model = EventAccessibilityFeature
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""
    class Meta:
        model = Comment
        fields = '__all__'