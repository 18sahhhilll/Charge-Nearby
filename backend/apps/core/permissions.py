from rest_framework import permissions

class IsHostUser(permissions.BasePermission):
    """Allows access to users with HOST, BOTH, or ADMIN roles."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['HOST', 'BOTH', 'ADMIN'] or request.user.is_staff

class IsDriverUser(permissions.BasePermission):
    """Allows access to users with DRIVER, BOTH, or ADMIN roles."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['DRIVER', 'BOTH', 'ADMIN'] or request.user.is_staff

class IsAdminRole(permissions.BasePermission):
    """Allows access only to users with ADMIN role or is_staff."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser

class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level permission allowing only the owner or an admin to edit/delete."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser:
            return True
        # Check standard ownership fields
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'host'):
            return obj.host == request.user
        if hasattr(obj, 'driver'):
            return obj.driver == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
