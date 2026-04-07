import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        if (userId) {
          await queryOne(
            `INSERT INTO billing_accounts (user_id, plan, stripe_subscription_id, stripe_customer_id, expiration, canceled)
             VALUES ($1, 'PREMIUM', $2, $3, NOW() + INTERVAL '1 month', false)
             ON CONFLICT (user_id) DO UPDATE SET plan = 'PREMIUM', stripe_subscription_id = $2, stripe_customer_id = $3, expiration = NOW() + INTERVAL '1 month', canceled = false`,
            [userId, session.subscription, session.customer]
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await queryOne(
          "UPDATE billing_accounts SET plan = 'FREE', canceled = true WHERE stripe_subscription_id = $1",
          [sub.id]
        );
        break;
      }
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
