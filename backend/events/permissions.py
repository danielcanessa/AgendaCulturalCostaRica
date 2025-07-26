"""
Custom permissions for the events app.
These classes define business rules for access control on API endpoints.
"""

from rest_framework import permissions

def is_admin(role):
    """
    Helper function to check if a role name represents an Administrator.
    """
    admin_roles = ['administrator', 'admin', 'superuser', 'root', 'administrador']
    if isinstance(role, str):
        return role.strip().lower() in admin_roles
    if hasattr(role, "name"):
        return str(role.name).strip().lower() in admin_roles
    return False

def is_admin_role(user):
    """
    Helper function to check if a user has the Administrator role.
    """
    return user.is_authenticated and is_admin(getattr(user, "role", None))

class IsAdmin(permissions.BasePermission):
    """
    Permission class to require the user to be an Administrator.
    Use for endpoints where only admin users are allowed.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and is_admin_role(request.user)

class IsAdminOrCreator(permissions.BasePermission):
    """
    Custom permission to grant access to:
    - Admin users (as determined by the is_admin_role() helper).
    - The creator/owner of the object, based on:
        * 'created_by' attribute (e.g., Organization, Event).
        * 'user' attribute (e.g., Comment, UserEvent).
        * Direct object match (when the object is the User instance itself).
    
    This class is intended for use with viewsets that perform object-level permission checks
    for update, partial update, and delete operations.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False

        # Admins always have permission
        if is_admin_role(user):
            return True

        # If the object is a User instance, allow if the requesting user is the same
        if isinstance(obj, type(user)):
            return obj == user

        # For other models, check ownership via 'created_by' or 'user' fields
        creator = getattr(obj, "created_by", None) or getattr(obj, "user", None)
        return creator == user