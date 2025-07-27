"""
URLs for events app.
Automatically generated API routes for all viewsets.
"""

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.urls import (
    path,
    include,
)
from .views import (
    CurrencyViewSet, UserRoleViewSet, OrganizationViewSet, UserViewSet,
    CategoryViewSet, EventViewSet, UserEventViewSet,
    AccessibilityFeatureViewSet, EventAccessibilityFeatureViewSet, CommentViewSet
)
from .auth_views import (
    EmailTokenObtainPairView,
    RegisterAPIView,
    LogoutAPIView,
    MeAPIView,
    ChangePasswordAPIView,
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
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path('me/', MeAPIView.as_view(), name='me'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change_password'),
    path('password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
