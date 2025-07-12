"""
Django admin registration for events app models.
This enables model management via Django admin UI.
"""

from django.contrib import admin
from .models import (
    Currency, UserRole, Organization, User, Category, Event,
    UserEvent, AccessibilityFeature, EventAccessibilityFeature, Comment
)

# Register all models for admin access
admin.site.register(Currency)
admin.site.register(UserRole)
admin.site.register(Organization)
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Event)
admin.site.register(UserEvent)
admin.site.register(AccessibilityFeature)
admin.site.register(EventAccessibilityFeature)
admin.site.register(Comment)