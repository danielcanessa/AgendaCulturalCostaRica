"""
Models for the events app.
Models define the structure of the data and relationships in the database.
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    """
    Custom manager for User model.
    Handles user creation and password hashing for compatibility with Django admin and JWT.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular User with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hashes the password using Django's password hasher
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class Currency(models.Model):
    """
    Stores currencies supported by the system, e.g., CRC, USD.
    Used for event pricing and to enable multi-currency support.
    """
    name = models.CharField(
        max_length=10,
        help_text="Currency code or abbreviation (e.g., CRC, USD)."
    )

    def __str__(self):
        return f"Currency(id={self.id}, name={self.name})"

class UserRole(models.Model):
    """
    Catalog of user roles for permissions and access control.
    Typical roles: Administrator, Visitor, Event Organizer.
    """
    name = models.CharField(
        max_length=45,
        help_text="Short role name (e.g., Administrator, Visitor)."
    )
    description = models.CharField(
        max_length=100,
        null=True, blank=True,
        help_text="Optional description for the role."
    )

    def __str__(self):
        return f"UserRole(id={self.id}, name={self.name})"

class Organization(models.Model):
    """
    Represents organizations that create and manage events.
    Each user can be linked to an organization.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Name of the organization (unique)."
    )
    phone = models.CharField(
        max_length=30,
        null=True, blank=True,
        help_text="Organization's contact phone number."
    )
    email = models.CharField(
        max_length=30,
        null=True, blank=True,
        help_text="Organization's contact email."
    )
    created_by = models.ForeignKey(
        'User',  # Self-referential foreign key to User
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='organizations_created',
        help_text="User who created this organization."
    )

    def __str__(self):
        return f"Organization(id={self.id}, name={self.name})"

class User(AbstractBaseUser, PermissionsMixin):
    """
    Stores user accounts for both event organizers and visitors.
    Includes authentication fields and links to roles/organizations.
    Compatible with Django admin and JWT authentication.
    """
    name = models.CharField(
        max_length=100,
        null=True, blank=True,
        help_text="User's name."
    )
    last_name = models.CharField(
        max_length=100,
        null=True, blank=True,
        help_text="User's last name."
    )
    email = models.EmailField(
        max_length=100,
        unique=True,
        help_text="Email address (used as login)."
    )
    phone = models.CharField(
        max_length=30,
        null=True, blank=True,
        help_text="User's phone number."
    )
    bio = models.TextField(
        null=True, blank=True,
        help_text="Short bio or introduction (optional)."
    )
    is_event_organizer = models.BooleanField(
        null=True, blank=True,
        help_text="True if the user has created events that have been published."
    )
    role = models.ForeignKey(
        'UserRole', on_delete=models.PROTECT,
        help_text="User's role (for access control)."
    )
    organization = models.ForeignKey(
        'Organization', on_delete=models.PROTECT,
        null=True, blank=True,
        help_text="Organization the user belongs to (optional)."
    )
    created_at = models.DateTimeField(
        auto_now_add=True, null=True,
        help_text="When the user account was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True, null=True,
        help_text="Last update timestamp."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active."
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="For Django admin compatibility (not used in app logic)."
    )
    is_superuser = models.BooleanField(
        default=False,
        help_text="For Django admin compatibility (not used in app logic)."
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"User(id={self.id}, name={self.name or ''} {self.last_name or ''}, email={self.email})"
    
class Category(models.Model):
    """
    Represents an event category (e.g., Music, Art, Sports).
    Used to classify events and optionally store an icon/image.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name (unique)."
    )
    description = models.CharField(
        max_length=255,
        null=True,
        help_text="Short description of the category."
    )
    image_path = models.CharField(
        max_length=255,
        null=True, 
        help_text="Path to the category icon or image (optional). Use ImageField for file storage."
    )

    def __str__(self):
        return f"Category(id={self.id}, name={self.name})"
    
class Event(models.Model):
    """
    Main event model.
    Stores all data for a published cultural event.
    """
    name = models.CharField(
        max_length=150,
        help_text="Event name."
    )
    description = models.TextField(
        help_text="Full event description (can use markdown/HTML if needed)."
    )
    start_datetime = models.DateTimeField(
        help_text="Event start date and time."
    )
    end_datetime = models.DateTimeField(
        null=True, blank=True,
        help_text="Event end date and time (optional)."
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True,
        help_text="Event price. Null if free."
    )
    currency = models.ForeignKey(
        Currency, on_delete=models.PROTECT,
        null=True,
        help_text="Currency for event price."
    )
    ticket_link = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text="URL for ticket sales (optional)."
    )
    contact_email = models.CharField(
        max_length=100,
        null=True, blank=True,
        help_text="Contact email for the event."
    )
    contact_phone = models.CharField(
        max_length=30,
        null=True, blank=True,
        help_text="Contact phone number."
    )
    address = models.CharField(
        max_length=255,
        help_text="Physical address or venue."
    )
    map_location = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text="Google Maps URL or coordinates (optional)."
    )
    created_by = models.ForeignKey(
        'User', on_delete=models.PROTECT, related_name='created_events',
        help_text="User who created the event."
    )
    is_event_approved = models.BooleanField(
        default=False,
        help_text="Event approval status (set by admin)."
    )
    last_request_change_reason = models.CharField(
        max_length=300,
        null=True, blank=True,
        help_text="Reason for latest change request (optional)."
    )
    delete_reason = models.CharField(
        max_length=300,
        null=True, blank=True,
        help_text="Reason for deletion (optional, for auditing)."
    )
    is_event_active = models.BooleanField(
        default=True,
        help_text="Whether the event is currently active (soft delete)."
    )
    approved_by = models.ForeignKey(
        'User', on_delete=models.PROTECT, related_name='approved_events',
        null=True,
        help_text="Admin user who approved the event."
    )
    created_at = models.DateTimeField(
        auto_now_add=True, null=True,
        help_text="Timestamp of event creation."
    )
    updated_at = models.DateTimeField(
        auto_now=True, null=True,
        help_text="Last update timestamp."
    )
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT,
        help_text="Event category."
    )
    event_banner_path = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text="Path to the event banner image (optional)."
    )

    def __str__(self):
        fields = [
            f"id={self.id}",
            f"name={self.name}",        
            f"category={self.category}",
        ]
        return "Event(" + ", ".join(fields) + ")"
    
class UserEvent(models.Model):
    """
    Associates users with events they have bookmarked ("My Agenda").
    Many-to-many relationship between User and Event.
    """
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE,
        help_text="Related event."
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user_events',
        help_text="Related user."
    )

    class Meta:
        unique_together = ('event', 'user')  # Ensures a user can't bookmark the same event more than once

    def __str__(self):
        return f"UserEvent(id={self.id}, user={self.user}, event={self.event})"

class AccessibilityFeature(models.Model):
    """
    Catalog of available accessibility features.
    Used to mark events as accessible for different needs (e.g., wheelchair access).
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Feature name (unique, e.g., Wheelchair access)."
    )
    description = models.CharField(
        max_length=500,
        null=True, blank=True,
        help_text="Feature description."
    )
    def __str__(self):
        return f"AccessibilityFeature(id={self.id}, name={self.name or 'AccessibilityFeature'})"

class EventAccessibilityFeature(models.Model):
    """
    Associates accessibility features with events.
    Many-to-many join between Event and AccessibilityFeature.
    """
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE,
        help_text="Event with accessibility feature."
    )
    accessibility_feature = models.ForeignKey(
        AccessibilityFeature, on_delete=models.CASCADE,
        help_text="Associated accessibility feature."
    )

    class Meta:
        unique_together = ('event', 'accessibility_feature')  # Only one record per event-feature pair

    def __str__(self):
        return f"EventAccessibilityFeature(id={self.id}, event={self.event}, feature={self.accessibility_feature})"

class Comment(models.Model):
    """
    Stores comments made by users on events.
    Can include an optional image (e.g., ticket proof, selfie at event).
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user_comments',
        help_text="User who made the comment."
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE,
        help_text="Event being commented on."
    )
    comment = models.TextField(
        help_text="The text content of the comment."
    )
    created_at = models.DateTimeField(
        auto_now_add=True, null=True,
        help_text="Timestamp of comment creation."
    )
    updated_at = models.DateTimeField(
        auto_now=True, null=True,
        help_text="Last update timestamp."
    )
    image_path = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text="Path to the comment image (optional)."
    )

    def __str__(self):
        return f"Comment(id={self.id}, user={self.user}, event={self.event})"