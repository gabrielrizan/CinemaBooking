import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublishableKey);
  }

  /**
   * Create a Payment Intent by calling the backend
   * @param amount Amount in cents (e.g., 1000 = $10)
   * @param currency Payment currency (default: 'usd')
   * @returns Observable with the client secret
   */
  createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.http.post<{ clientSecret: string }>('/api/payments/create-payment-intent/', {
      amount,
      currency
    });
  }

  /**
   * Confirm the payment on the frontend
   * @param clientSecret The client secret returned from the backend
   * @param cardElement The card element created by Stripe
   * @param billingDetails Optional billing details (e.g., name)
   * @returns Promise resolving to the payment result
   */
  async confirmPayment(clientSecret: string, cardElement: any, billingDetails?: { name: string }) {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe has not been loaded!');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails
      }
    });

    if (error) {
      console.error('Payment failed:', error.message);
      return { success: false, error: error.message };
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful:', paymentIntent);
      return { success: true, paymentIntent };
    }

    return { success: false, error: 'Unknown error occurred' };
  }

  /**
   * Load Stripe Elements for the payment form
   * @returns Stripe Elements instance
   */
  async loadStripeElements() {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe has not been loaded!');
    }

    return stripe.elements();
  }
}

// stripe listen --forward-to http://127.0.0.1:8000/api/payments/webhook/ this is the command for spinning the stripe CLI to listen to events 