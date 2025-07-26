"""
ViewSets for the events app.
Each ViewSet provides the API endpoints (CRUD) for its model.
"""

from rest_framework import (
    viewsets,
    status
)
from rest_framework.response import Response
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)
from rest_framework.decorators import action
from .models import (
    Currency, UserRole, Organization, User, Category, Event,
    UserEvent, AccessibilityFeature, EventAccessibilityFeature, Comment
)
from .serializers import (
    CurrencySerializer, UserRoleSerializer, OrganizationSerializer, UserSerializer,
    CategorySerializer, EventSerializer, UserEventSerializer,
    AccessibilityFeatureSerializer, EventAccessibilityFeatureSerializer, CommentSerializer
)
from .permissions import (
    is_admin,
    IsAdmin, # DFR BasePermission
    IsAdminOrCreator # DFR BasePermission
)

import os

#  Accessibility:
#
# | Model                     | GET            | POST           | PUT/PATCH        | DELETE           |
# |---------------------------|----------------|----------------|------------------|------------------|
# | Currency                  | Authenticated  | Admin          | Admin            | Admin            |
# | UserRole                  | Public         | -              | -                | -                |
# | Organization              | Authenticated  | Authenticated  | Admin/Creator    | Admin/Creator    |
# | User                      | Creator/Admin  | -              | Creator/Admin    | Creator/Admin    |
# | Category                  | Public         | Admin          | Admin            | Admin            |
# | Event                     | Public         | Authenticated  | Admin/Creator    | Admin/Creator    |
# | UserEvent                 | Creator/Admin  | Authenticated  | Creator/Admin    | Creator/Admin    |
# | AccessibilityFeature      | Admin          | Admin          | Admin            | Admin            |
# | EventAccessibilityFeature | Admin/Creator  | Admin/Creator  | Admin/Creator    | Admin/Creator    |
# | Comment                   | Public         | Authenticated  | Creator          | Admin/Creator    |
#
# Legend:
#   Admin: User with “Administrator” role.
#   Creator: The user who created the object (e.g., event, organization, comment).
#   Authenticated: Any authenticated user.
#   Public: No authentication required.
#   “-”: Not available/not exposed.

class DeleteFileHelperMixin:
    """
    Provides a method to delete a file from disk.
    Intended to be used as a helper from your ViewSet.
    """
    def _delete_file(self, file_path):
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

class CurrencyViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing or editing Currency."""

    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def get_permissions(self):
        # Allow only authenticated users for GET (list/retrieve)
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # Allow only admins for POST, PUT, PATCH, DELETE
        return [IsAdmin()]

class UserRoleViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing UserRole. Only GET is allowed (public)."""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [AllowAny]   

    def create(self, request, *args, **kwargs):
        return Response({'detail': 'Method "POST" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response({'detail': 'Method "PUT" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response({'detail': 'Method "PATCH" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'Method "DELETE" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing or editing Organization.
    - Authenticated users can view and create organizations.
    - Only admin or the creator can update/delete.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        """
        Assign permissions based on action.
        - List/Retrieve/Create: Authenticated.
        - Update/Destroy: Admin or creator (object-level).
        """
        if self.action in ['list', 'retrieve', 'create']:
            return [IsAuthenticated()]
        return [IsAdminOrCreator()]

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing or editing User.
    - Only the user themself or an admin can retrieve/update/delete a user.
    - User creation is not allowed here (handled by a custom register endpoint).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAdmin()] 
        return [IsAdminOrCreator()]

    def get_queryset(self):
        user = self.request.user
        if is_admin(user):
            return User.objects.all()
        return User.objects.filter(pk=user.pk)
    
    def create(self, request, *args, **kwargs):
        """
        Block creation via this endpoint. Use /register/ instead.
        """
        return Response({'detail': 'Method "POST" not allowed. Use /register/ endpoint.'},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)

class CategoryViewSet(viewsets.ModelViewSet, DeleteFileHelperMixin):
    """
    API endpoint for viewing or editing Category.
    - Any user can view (GET) categories.
    - Only admin can create, update, or delete categories.
    - When deleting, also deletes the associated image file on disk.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
         # Allow public users to list/retrieve (GET), admin for everything else
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdmin()]

    def perform_destroy(self, instance):
        """
        Delete associated image file on disk when deleting Category instance.
        """
        self._delete_file(instance.image_path)
        instance.delete()

class EventViewSet(viewsets.ModelViewSet, DeleteFileHelperMixin):
    """API endpoint for viewing or editing Event."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        """
        Assign permissions based on action.
        - list/retrieve: Public (anyone)
        - create: Authenticated user
        - update/partial_update/destroy: Admin or creator (object-level)
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated()]
        if self.action == 'approve':
            return [IsAdmin()]
        return [IsAdminOrCreator()]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """
        Custom endpoint for approving an event.
        Only admins can approve events.
        """
        event = self.get_object()
        if event.is_event_approved:
            return Response(
                {"detail": "Event is already approved."},
                status=status.HTTP_400_BAD_REQUEST
            )
        event.is_event_approved = True
        event.approved_by = request.user
        event.save()
        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        """
        Delete associated banner image file on disk when deleting Event instance.
        """
        self._delete_file(instance.event_banner_path)
        instance.delete()

class UserEventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing or editing UserEvent.
    - GET/PUT/PATCH/DELETE: Only creator or admin.
    - POST: Any authenticated user (creates for themselves).
    """
    queryset = UserEvent.objects.all()
    serializer_class = UserEventSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Any authenticated user can create a UserEvent for themselves.
            return [IsAuthenticated()]
        # All other actions require admin or creator (object-level).
        return [IsAdminOrCreator()]

    def get_queryset(self):
        user = self.request.user
        # Admin sees all, others see only their own
        if is_admin(user):
            return UserEvent.objects.all()
        return UserEvent.objects.filter(user=user)

class AccessibilityFeatureViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing or editing AccessibilityFeature.
    Only admin users can access any method (GET, POST, PUT/PATCH, DELETE).
    """
    queryset = AccessibilityFeature.objects.all()
    serializer_class = AccessibilityFeatureSerializer

    def get_permissions(self):
        """
        All actions require the user to be an admin.
        """
        return [IsAdmin()]

class EventAccessibilityFeatureViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creating, updating, or deleting EventAccessibilityFeature.
    - GET (list/retrieve) is not allowed.
    - POST, PUT, PATCH, DELETE: only admin or creator allowed.
    """
    queryset = EventAccessibilityFeature.objects.all()
    serializer_class = EventAccessibilityFeatureSerializer

    def get_permissions(self):
        # Only allow POST, PUT, PATCH, DELETE (admin/creator)
        return [IsAdminOrCreator()]

class CommentViewSet(viewsets.ModelViewSet, DeleteFileHelperMixin):
    """API endpoint for viewing or editing Comment."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        """
        Assign permissions based on action.
        - list/retrieve: Public (anyone can see comments).
        - create: Authenticated user only.
        - update/partial_update: Only creator can update.
        - destroy: Admin or creator can delete.
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action == 'create':
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update']:
            return [IsAdminOrCreator()]
        elif self.action == 'destroy':
            return [IsAdminOrCreator()]
        # Default: require authentication
        return [IsAuthenticated()]

    def perform_destroy(self, instance):
        """
        Delete associated image file on disk when deleting Comment instance.
        """
        self._delete_file(instance.image_path)
        instance.delete()