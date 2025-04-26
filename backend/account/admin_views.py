from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser
from .models import User
from .serializers import CustomUserSerializer
from tickets.models import Ticket
from tickets.serializers import TicketSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer

class AdminTicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAdminUser]

    @action(
        detail=True,
        methods=['patch'],
        url_path='cancel',
        permission_classes=[IsAdminUser]
    )
    def cancel(self, request, pk=None):
        ticket = self.get_object()
        ticket.payment_status = 'CANCELLED'
        ticket.save(update_fields=['payment_status'])
        return Response({'status': 'CANCELLED'}, status=status.HTTP_200_OK)