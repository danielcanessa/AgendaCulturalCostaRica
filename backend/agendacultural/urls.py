from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.views import CategoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
