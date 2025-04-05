from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.views import APIView

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)  
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        ticket = self.get_object()
        ticket.payment_status = 'COMPLETED'
        ticket.payment_intent_id = request.data.get('payment_intent_id')
        ticket.save()
        return Response({'status': 'payment confirmed'})

class ReservedSeatsView(APIView):
    def get(self, request, format=None):
        showtime_id = request.query_params.get('showtime_id')
        if not showtime_id:
            return Response({"error": "Missing showtime_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        # First, check if any tickets exist for this showtime
        all_tickets = Ticket.objects.filter(showtime_id=showtime_id)
        print(f"Found {all_tickets.count()} total tickets for showtime {showtime_id}")
        
        # Then filter by payment status
        completed_tickets = all_tickets.filter(payment_status='COMPLETED')
        print(f"Found {completed_tickets.count()} completed tickets")
        
        reserved_labels = []
        for ticket in completed_tickets:
            reserved_labels.extend(ticket.seats)
        
        unique_labels = list(set(reserved_labels))
        print(f"Reserved seats: {unique_labels}")
        
        return Response(unique_labels, status=status.HTTP_200_OK)