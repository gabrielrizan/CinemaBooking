from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
import json
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tickets.models import Ticket

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
@api_view(['POST'])
def create_checkout_session(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        line_items = []
        for category, quantity in data['ticketCounts'].items():
            if quantity > 0:
                price_id = data['prices'][category]
                line_items.append({
                    'price': price_id,
                    'quantity': quantity,
                })
        
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:4200/select-tickets?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:4200/select-tickets?error=payment_cancelled',
                metadata={
                    'ticket_id': data.get('ticketId')
                }
            )
            return Response({'url': checkout_session.url})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            ticket_id = session['metadata']['ticket_id']
            
            # Update ticket status
            ticket = Ticket.objects.get(id=ticket_id)
            ticket.payment_status = 'COMPLETED'
            ticket.save()

            return Response({'status': 'success'})

    except Exception as e:
        return Response({'error': str(e)}, status=400)

    return Response({'status': 'success'})