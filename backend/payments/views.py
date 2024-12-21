from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
import json
from django.conf import settings

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        line_items = []
        for category, quantity in data['ticketCounts'].items():
            if quantity > 0:
                price_id = data['prices'][category]  # Define price IDs for ticket categories
                line_items.append({
                    'price': price_id,
                    'quantity': quantity,
                })
        
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:4200/tickets/confirmation?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:4200/tickets/selection',
                metadata=data.get('metadata', {}),
                custom_text={
                    'submit': {'message': '🎬 Complete your movie ticket purchase'},
                    'after_submit': {'message': 'We\'re confirming your tickets...'}
                },
            )
            return JsonResponse({'url': checkout_session.url})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)