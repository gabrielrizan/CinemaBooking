from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import User
from .serializers import CustomUserSerializer
from tickets.models import Ticket
from tickets.serializers import TicketSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer

class AdminTicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer 