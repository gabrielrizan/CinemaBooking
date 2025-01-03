from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import AdminUserViewSet, AdminTicketViewSet

router = DefaultRouter()
router.register('admin/users', AdminUserViewSet)
router.register('admin/tickets', AdminTicketViewSet)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('', include(router.urls)),
]
