from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

router = DefaultRouter()
router.register('', TicketViewSet, basename='tickets')

urlpatterns = router.urls 