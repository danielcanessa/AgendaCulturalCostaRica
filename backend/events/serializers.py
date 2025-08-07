"""
Serializers for the events app.
Serializers convert model instances to JSON for the API and validate input data.
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import (
    make_password
)
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
import binascii
import logging

from .permissions import is_admin

# Set up logger for your module
logger = logging.getLogger(__name__)

############################## Common logic ##############################
    
class Base64ImageHelperMixin:
    """
    Mixin to handle conversion between image files and base64 strings for serializers.
    Used for optional image uploads/downloads as base64.
    """

    def _get_image_base64(self, image_path):
        """
        Reads an image file from disk and returns its contents as a base64 string.
        Returns None if file is missing or unreadable (images are optional).
        Logs any exception for debugging.
        """
        if image_path and os.path.exists(image_path):
            try:
                with open(image_path, "rb") as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except Exception as e:
                # Log the error, but don't expose to client
                logger.warning(f"Failed to read image {image_path}: {str(e)}")
                return None
        return None

    def _save_image_from_base64(self, base64_data, prefix):
        """
        Saves an image from a base64 string to disk, using a unique filename.
        Returns the file path. Raises serializers.ValidationError if base64 is invalid.
        Logs any file write error for debugging.
        """
        try:
            image_bytes = base64.b64decode(base64_data)
        except (binascii.Error, ValueError):
            raise serializers.ValidationError("Invalid base64 image data.")

        filename = f"../images/{prefix}_{uuid.uuid4().hex}.png"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        try:
            with open(filename, "wb") as f:
                f.write(image_bytes)
        except Exception as e:
            # Log the error, raise a generic error to the client
            logger.error(f"Failed to write image {filename}: {str(e)}")
            raise serializers.ValidationError("Failed to save image file.")
        return filename

############################### Currency Serializers ##############################

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for Currency model."""
    class Meta:
        model = Currency
        fields = '__all__'

########################### Lean Serializer ##############################
class RoleLeanSerializer(serializers.ModelSerializer):
    """Returns only id and name for the role."""
    class Meta:
        model = UserRole
        fields = ("id", "name")

class OrganizationLeanSerializer(serializers.ModelSerializer):
    """Returns only id and name for the organization."""
    class Meta:
        model = Organization
        fields = ("id", "name")

class UserLeanSerializer(serializers.ModelSerializer):
    """Returns a lean representation of the user with role and organization."""
    role = RoleLeanSerializer(read_only=True)
    organization = OrganizationLeanSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "name", "last_name", "role", "organization")

class CategoryLeanSerializer(serializers.ModelSerializer):
    """
    Lean serializer for Category, only returns id and name.
    """
    class Meta:
        model = Category
        fields = ("id", "name")

class AccessibilityFeatureLeanSerializer(serializers.ModelSerializer):
    """
    Lean serializer for AccessibilityFeature, only returns id and name.
    """
    class Meta:
        model = AccessibilityFeature
        fields = ("id", "name")
        
class EventLeanSerializer(serializers.ModelSerializer):
    """
    Lean serializer for Event.
    Includes category (lean), currency (expanded), and accessibility features (expanded list).
    """
    category = CategoryLeanSerializer(read_only=True)
    currency = CurrencySerializer(read_only=True)
    accessibility_features = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            "id",
            "name",
            "start_datetime",
            "price",
            "is_event_approved",
            "is_event_active",
            "category",
            "currency",
            "accessibility_features"
        )

    def get_accessibility_features(self, obj):
        # This retrieves all AccessibilityFeature objects related to this Event via the join table
        features = EventAccessibilityFeature.objects.filter(event=obj)
        return [
            AccessibilityFeatureLeanSerializer(ef.accessibility_feature).data
            for ef in features
        ]
    
############################## Models Serializers ##############################

class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer for UserRole model."""
    class Meta:
        model = UserRole
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model."""
    # Read-only field: expands created_by as a lean user object in GET responses
    created_by = UserLeanSerializer(read_only=True)

    class Meta:
        model = Organization
        fields = ('id', 'name', 'phone', 'email', 'created_by')

    def create(self, validated_data):
        """
        Overrides the default create method to always set the 'created_by' field
        to the currently authenticated user, regardless of any input provided by the client.
        This ensures organizations cannot be created on behalf of other users.
        """
        user = self.context['request'].user  # Get the authenticated user from the request context
        validated_data['created_by'] = user  # Assign the creator of the organization
        return super().create(validated_data)
    
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Converts User model instances to JSON and handles validation for API operations.
    """
    # Password field is write-only: user can set it, but it never appears in responses.
    password = serializers.CharField(write_only=True, required=False)

    # Display lean role info (expanded using RoleLeanSerializer) in the response (GET).
    role = RoleLeanSerializer(read_only=True)

    # Display full organization info in the response (GET).
    organization = OrganizationSerializer(read_only=True)

    # Accept role by ID for input (POST/PUT) -- this field is write-only.
    role_id = serializers.PrimaryKeyRelatedField(
        source='role',  # Field in the model to assign the input to
        queryset=UserRole.objects.all(),
        write_only=True,  # Do not show in responses
        required=True     # Role is required
    )

    # Accept organization by ID for input (POST/PUT) -- this field is write-only.
    organization_id = serializers.PrimaryKeyRelatedField(
        source='organization',
        queryset=Organization.objects.all(),
        write_only=True,     # Do not show in responses
        required=False,      # Org is optional
        allow_null=True
    )

    class Meta:
        model = User
        # Fields for output (GET) and input (POST/PUT).
        # - Show expanded info for 'role' and 'organization'
        # - Use role_id and organization_id for input (POST/PUT)
        fields = (
            'id', 'name', 'last_name', 'email', 'password', 'phone', 'bio',
            'created_at', 'updated_at', 'is_event_organizer',
            'role',          # Expanded role (object, read-only)
            'role_id',       # Role id (write-only, for POST/PUT)
            'organization',  # Expanded organization (object, read-only)
            'organization_id',  # Organization id (write-only, for POST/PUT)
        )

    def create(self, validated_data):
        password = validated_data.pop('password', None)        
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})

        is_staff = False
        is_superuser = False

        role_obj = validated_data.get('role')
        if is_admin(role_obj):
            is_staff = True
            is_superuser = True

        user = User(
            **validated_data,
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Do NOT allow password change via update
        validated_data.pop('password', None)  # Ignore any password present
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
        fields = ['id', 'name', 'description', 'image_base64', 'image_alt']

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
    Serializer for the Event model.
    Expands all foreign key references for GET.
    Handles event banner conversion between base64 and file storage.
    """

    # Return banner as base64 string for GET and accept it for POST/PUT
    event_banner_base64 = serializers.CharField(required=False)

    # Expand currency in output (GET)
    currency = CurrencySerializer(read_only=True)
    
    # Input currency by id in POST/PUT
    currency_id = serializers.PrimaryKeyRelatedField(
        source='currency', queryset=Currency.objects.all(), write_only=True, required=False, allow_null=True
    )

    # Expand category in output (GET)
    category = CategoryLeanSerializer(read_only=True)

    # Input category by id in POST/PUT
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True
    )

    # Expand created_by user in output (GET)
    created_by = UserLeanSerializer(read_only=True)

    # Expand approved_by user in output (GET)
    approved_by = UserLeanSerializer(read_only=True)

    # Expand accessibility features in output (GET)
    accessibility_features = serializers.SerializerMethodField()

    class Meta:
        model = Event
        # Fields for output (GET) and input (POST/PUT).
        # - Expands related fields ('currency', 'category', 'created_by', 'approved_by', 'accessibility_features') for GET.
        # - Uses *_id fields for input (POST/PUT) for easier frontend usage.
        # - 'event_banner_base64' is a virtual field for sending/receiving the event banner as a base64 string.
        fields = [
            # --- Model fields ---
            'id', 'name', 'description', 'start_datetime', 'end_datetime', 'price',
            'ticket_link', 'contact_email', 'contact_phone', 'address', 'map_location',
            'is_event_approved', 'last_request_change_reason', 'delete_reason',
            'is_event_active', 'created_at', 'updated_at', 'event_banner_alt',
            'created_by',            # Expanded user info (read-only, GET)            
            'approved_by',           # Expanded user info (read-only, GET)
            'category',              # Expanded category info (read-only, GET)
            'currency',              # Expanded currency info (read-only, GET)
            # --- Serializer-only/virtual fields ---
            'currency_id',           # For input (POST/PUT), to set currency by id
            'category_id',           # For input (POST/PUT), to set category by id
            'event_banner_base64',   # For sending/receiving event banner as base64 string
            'accessibility_features' # Expanded list of accessibility features (read-only, GET)
        ]
        read_only_fields = ['approved_by']

    def get_accessibility_features(self, obj):
        # This retrieves all AccessibilityFeature objects related to this Event via the join table
        features = EventAccessibilityFeature.objects.filter(event=obj)
        return [
            AccessibilityFeatureLeanSerializer(ef.accessibility_feature).data
            for ef in features
        ]

    def to_representation(self, instance):
        # Add event_banner_base64 to the GET response as a base64 string
        data = super().to_representation(instance)
        data['event_banner_base64'] = self._get_image_base64(instance.event_banner_path)
        return data

    def create(self, validated_data):
        # Handle event banner image if provided as base64
        base64_data = validated_data.pop('event_banner_base64', None)
        if base64_data:
            validated_data['event_banner_path'] = self._save_image_from_base64(
                base64_data, 'event_banner_' + validated_data['name']
            )

        # Set created_by to the authenticated user
        user = self.context['request'].user
        validated_data['created_by'] = user

        # approved_by is always None when created
        validated_data['approved_by'] = None

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle event banner image if provided as base64
        base64_data = validated_data.pop('event_banner_base64', None)
        if base64_data:
            if instance.event_banner_path and os.path.exists(instance.event_banner_path):
                os.remove(instance.event_banner_path)
            validated_data['event_banner_path'] = self._save_image_from_base64(
                base64_data, 'event_banner_' + validated_data['name']
            )

        # On any update, set event as not approved again
        if 'is_event_approved' not in validated_data:
            validated_data['is_event_approved'] = False
            validated_data['approved_by'] = None 
        # Do not change created_by or approved_by here (handled via custom endpoints if needed)
        return super().update(instance, validated_data)

 
class UserEventSerializer(serializers.ModelSerializer):
    """
    Serializer for UserEvent model.
    - Expands related fields ('event', 'user') in GET.
    - Uses event_id for input (POST/PUT) for easier frontend usage.
    """

    event = EventLeanSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        source='event', queryset=Event.objects.all(), write_only=True
    )
    user = UserLeanSerializer(read_only=True)

    class Meta:
        model = UserEvent
        fields = [
            'id',
            'event',       # Expanded event info (read-only, GET)
            'event_id',    # For input (POST/PUT), to set event by id
            'user',        # Expanded user info (read-only, GET)
        ]

    def create(self, validated_data):
        request = self.context['request']
        validated_data['user'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)

class AccessibilityFeatureSerializer(serializers.ModelSerializer):
    """Serializer for AccessibilityFeature model."""
    class Meta:
        model = AccessibilityFeature
        fields = '__all__'

class EventAccessibilityFeatureSerializer(serializers.ModelSerializer):
    """
    Serializer for EventAccessibilityFeature model.
    - Expands related fields ('event', 'accessibility_feature') in GET.
    - Uses *_id fields for input (POST/PUT).
    """
    # Expand event info in output (GET)
    event = EventLeanSerializer(read_only=True)
   
    # Input event by id in POST/PUT
    event_id = serializers.PrimaryKeyRelatedField(
        source='event', queryset=Event.objects.all(), write_only=True
    )

    # Expand accessibility feature info in output (GET)
    accessibility_feature = AccessibilityFeatureSerializer(read_only=True)
    
    # Input accessibility_feature by id in POST/PUT
    accessibility_feature_id = serializers.PrimaryKeyRelatedField(
        source='accessibility_feature', queryset=AccessibilityFeature.objects.all(), write_only=True
    )

    class Meta:
        model = EventAccessibilityFeature
        # Fields for output (GET) and input (POST/PUT).
        # - Expands related fields ('event', 'accessibility_feature') for GET.
        # - Uses *_id fields for input (POST/PUT).
        fields = [
            'id',
            'event',                    # Expanded event info (read-only, GET)
            'event_id',                 # For input (POST/PUT), to set event by id
            'accessibility_feature',    # Expanded accessibility_feature info (read-only, GET)
            'accessibility_feature_id', # For input (POST/PUT), to set accessibility_feature by id
        ]

class CommentSerializer(Base64ImageHelperMixin, serializers.ModelSerializer):
    """
    Serializer for Comment model.
    - Expands related fields ('user', 'event') in GET.
    - Uses event_id for input (POST/PUT) for easier frontend usage.
    - Handles image conversion between base64 and file storage (image_base64).
    """
    image_base64 = serializers.CharField(required=False)

    user = UserLeanSerializer(read_only=True)  # Output only
    event = EventLeanSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        source='event', queryset=Event.objects.all(), write_only=True
    )

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',         # Expanded user info (read-only, GET)
            'event',        # Expanded event info (read-only, GET)
            'event_id',     # For input (POST/PUT), to set event by id
            'comment',
            'created_at',
            'updated_at',
            'image_base64', # For sending/receiving comment image as base64 string
            'image_alt',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_base64'] = self._get_image_base64(instance.image_path)
        return data

    def create(self, validated_data):
        # Always use authenticated user
        request = self.context['request']
        validated_data['user'] = request.user
        base64_data = validated_data.pop('image_base64', None)
        if base64_data:
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'comment')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Never allow changing user
        validated_data.pop('user', None)
        base64_data = validated_data.pop('image_base64', None)
        if base64_data:
            if instance.image_path and os.path.exists(instance.image_path):
                os.remove(instance.image_path)
            validated_data['image_path'] = self._save_image_from_base64(base64_data, 'comment')
        return super().update(instance, validated_data)

############################## Custom Serializers ##############################

class EmailTokenObtainPairSerializer(serializers.Serializer):
    """
    Custom JWT serializer for authenticating using email and password.
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        """
        Validates email and password, and returns JWT tokens if successful.
        """
        email = attrs.get("email")
        password = attrs.get("password")

        # Find user by email (case-insensitive optional)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user exists with that email.")

        # Check password using your hash field
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        # Generate JWT tokens manually for your custom user
        refresh = RefreshToken.for_user(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserLeanSerializer(user).data,
        }
        return data

    @classmethod
    def get_token(cls, user):
        """
        Add custom fields to the JWT payload if needed.
        """
        token = RefreshToken.for_user(user)
        token['email'] = user.email
        token['name'] = user.name
        token['last_name'] = user.last_name
        token['role'] = user.role.name if user.role else ""
        return token

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
