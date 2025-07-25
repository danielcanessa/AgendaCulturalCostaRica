"""
URLs for events app.
Automatically generated API routes for all viewsets.
"""

from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    CurrencyViewSet, UserRoleViewSet, OrganizationViewSet, UserViewSet,
    CategoryViewSet, EventViewSet, UserEventViewSet,
    AccessibilityFeatureViewSet, EventAccessibilityFeatureViewSet, CommentViewSet
)
from .auth_views import (
    LoginAPIView
)

# Register API endpoints for all models
router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)
router.register(r'userroles', UserRoleViewSet)
router.register(r'organizations', OrganizationViewSet)
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet)
router.register(r'userevents', UserEventViewSet)
router.register(r'accessibilityfeatures', AccessibilityFeatureViewSet)
router.register(r'eventaccessibilityfeatures', EventAccessibilityFeatureViewSet)
router.register(r'comments', CommentViewSet)

# Combine router URLs and manual ones
urlpatterns = router.urls + [
    path('login/', LoginAPIView.as_view(), name='login'),
]
