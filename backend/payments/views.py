from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
import json
from django.conf import settings

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_payment_intent(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = data.get('amount')  # Amount in cents
            currency = data.get('currency', 'usd')  # Default to USD

            # Create a PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
            )

            return JsonResponse({'clientSecret': intent.client_secret})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
