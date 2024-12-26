from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id', 
            'movie_title', 
            'movie_id', 
            'showtime', 
            'seats', 
            'ticket_type', 
            'total_amount',
            'payment_status',
            'poster'
        ]
        read_only_fields = ['id', 'payment_status']