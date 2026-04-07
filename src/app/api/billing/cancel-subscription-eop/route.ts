import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const billing = await queryOne<{ stripe_subscription_id: string; plan: string; expiration: string }>(
    'SELECT stripe_subscription_id, plan, expiration FROM billing_accounts WHERE user_id = $1', [auth.sub]
  );

  if (!billing?.stripe_subscription_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  const stripe = getStripe();
  await stripe.subscriptions.update(billing.stripe_subscription_id, { cancel_at_period_end: true });

  return NextResponse.json({ success: true, canceled_plan: billing.plan, current_expiration: billing.expiration });
}
