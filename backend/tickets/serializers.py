from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_firstname = serializers.CharField(source='user.firstname', read_only=True)
    user_lastname = serializers.CharField(source='user.lastname', read_only=True)
    showtime_date = serializers.DateField(source='showtime.date', read_only=True)
    showtime_time = serializers.TimeField(source='showtime.time', read_only=True)


    class Meta:
        model = Ticket
        fields = [
            'id', 
            'movie_title', 
            'movie_id', 
            'showtime',
            'showtime_date',     
            'showtime_time',     
            'seats', 
            'ticket_type', 
            'total_amount',
            'payment_status',
            'poster',
            'user_email',
            'user_firstname',
            'user_lastname',
        ]
        read_only_fields = ['id', 'payment_status']