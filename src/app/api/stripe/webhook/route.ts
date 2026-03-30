import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email;
      const sessionId = session.id;

      console.log('Purchase completed:', {
        sessionId,
        customerEmail,
        amount: session.amount_total,
        currency: session.currency,
      });

      // TODO: Insert into Supabase artquitech_purchases table
      // Example:
      // const { data, error } = await supabase
      //   .from('artquitech_purchases')
      //   .insert([
      //     {
      //       customer_email: customerEmail,
      //       stripe_session_id: sessionId,
      //       amount: session.amount_total,
      //       currency: session.currency,
      //       status: 'completed',
      //       created_at: new Date().toISOString(),
      //     },
      //   ]);
      //
      // if (error) {
      //   console.error('Failed to insert purchase record:', error);
      // }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}
