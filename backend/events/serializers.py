"""
Serializers for the events app.
Serializers convert model instances to JSON for the API and validate input data.
"""

from rest_framework import serializers
from .models import (
    Currency, 
    UserRole, 
    Organization, 
    User, 
    Category, 
    Event,
    UserEvent, 
    AccessibilityFeature, 
    EventAccessibilityFeature, 
    Comment
)
import os
import uuid
import base64
from django.contrib.auth.hashers import (
    make_password
)

class Base64ImageHelperMixin:
    """
    Mixin to provide helper methods for converting image files to base64 strings
    and saving base64 strings as image files. Intended for use in serializers
    that need to handle image uploads/downloads as base64 strings.
    """

    def _get_image_base64(self, image_path):
        """
        Reads an image file from disk and returns its contents as a base64 string.
        Returns None if the file does not exist or cannot be read.
        """
        if image_path and os.path.exists(image_path):
            try:
                with open(image_path, "rb") as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except Exception:
                return None
        return None

    def _save_image_from_base64(self, base64_data, prefix):
        """
        Saves an image from a base64 string to disk, using a unique filename
        with the given prefix. Returns the file path.
        """
        image_bytes = base64.b64decode(base64_data)
        filename = f"../images/{prefix}_{uuid.uuid4().hex}.png"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "wb") as f:
            f.write(image_bytes)
        return filename

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
    
    # Custom field to handle password hashing
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password_hash': {'required': False, 'write_only': True}  # Ensure it's excluded from GET responses
        }
    
    def create(self, validated_data):
        # Get the password from validated_data, hash it and remove it from the validated_data
        password = validated_data.pop('password')
        validated_data['password_hash'] = make_password(password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # If password is provided, hash it and remove from validated_data
        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password_hash'] = make_password(password)
        return super().update(instance, validated_data)

class CategorySerializer(Base64ImageHelperMixin, serializers.ModelSerializer):
    """
    Serializer for Category model.
    Handles image conversion between base64 and file storage.

    - image_base64: field used for both input (POST/PUT) and output (GET).
    """
    image_base64 = serializers.CharField(required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image_base64']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_base64'] = self._get_image_base64(instance.image_path)
        return data

    def create(self, validated_data):        
        base64_data = validated_data.pop('image_base64', None)        
        if base64_data:
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'category_'+validated_data['name'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        base64_data = validated_data.pop('image_base64', None)
        if base64_data:
            if instance.image_path and os.path.exists(instance.image_path):
                os.remove(instance.image_path)
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'category_'+validated_data['name'])
        return super().update(instance, validated_data)

class EventSerializer(Base64ImageHelperMixin, serializers.ModelSerializer):
    """
    Serializer for Event model.
    Handles event banner conversion between base64 and file storage.

    - event_banner_base64: field used for both input (POST/PUT) and output (GET).
    """
    event_banner_base64 = serializers.CharField(required=False)

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'start_datetime', 'end_datetime', 'price', 'currency',
            'ticket_link', 'contact_email', 'contact_phone', 'address', 'map_location',
            'created_by', 'is_event_approved', 'last_request_change_reason', 'delete_reason',
            'is_event_active', 'approved_by', 'created_at', 'updated_at', 'category', 'event_banner_base64'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['event_banner_base64'] = self._get_image_base64(instance.event_banner_path)
        return data

    def create(self, validated_data):
        base64_data = validated_data.pop('event_banner_base64', None)
        if base64_data:
            validated_data['event_banner_path'] = self._save_image_from_base64(base64_data, 'event_banner_'+validated_data['name'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        base64_data = validated_data.pop('event_banner_base64', None)
        if base64_data:
            if instance.event_banner_path and os.path.exists(instance.event_banner_path):
                os.remove(instance.event_banner_path)
            validated_data['event_banner_path'] = self._save_image_from_base64(base64_data, 'event_banner_'+validated_data['name'])
        return super().update(instance, validated_data)

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

class CommentSerializer(Base64ImageHelperMixin, serializers.ModelSerializer):
    """
    Serializer for Comment model.
    Handles image conversion between base64 and file storage.

    - image_base64: field used for both input (POST/PUT) and output (GET).
    """
    image_base64 = serializers.CharField(required=False)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'event', 'comment', 'created_at', 'updated_at', 'image_base64']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_base64'] = self._get_image_base64(instance.image_path)
        return data

    def create(self, validated_data):
        base64_data = validated_data.pop('image_base64', None)
        if base64_data:
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'comment')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        base64_data = validated_data.pop('image_base64', None)
        if base64_data:
            if instance.image_path and os.path.exists(instance.image_path):
                os.remove(instance.image_path)
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'comment')
        return super().update(instance, validated_data)