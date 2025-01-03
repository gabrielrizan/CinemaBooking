from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('movie_title', 'user', 'showtime', 'total_amount', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'showtime', 'created_at')
    search_fields = ('movie_title', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Ticket Information', {
            'fields': ('user', 'movie_title', 'movie_id', 'showtime', 'seats', 'poster')
        }),
        ('Payment Information', {
            'fields': ('ticket_type', 'total_amount', 'payment_status', 'payment_intent_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        # Prevent manual ticket creation through admin
        return False
