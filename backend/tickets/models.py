from django.db import models
from django.conf import settings
from catalog.models import ShowTime


class Ticket(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie_title = models.CharField(max_length=255)
    movie_id = models.IntegerField()
    showtime = models.ForeignKey(ShowTime, on_delete=models.SET_NULL, null=True, blank=True)
    seats = models.JSONField()  
    ticket_type = models.JSONField()  
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    payment_intent_id = models.CharField(max_length=255, blank=True)
    poster = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.movie_title} - {self.showtime}"