from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, ReservedSeatsView

router = DefaultRouter()
router.register('', TicketViewSet, basename='tickets')

urlpatterns = [
    path('reserved/', ReservedSeatsView.as_view(), name='reserved-seats'),
]

urlpatterns += router.urls