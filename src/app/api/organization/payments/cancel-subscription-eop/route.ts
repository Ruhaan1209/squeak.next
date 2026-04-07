import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const org = await queryOne<{ stripe_subscription_id: string; plan: string; expiration_date: string }>(
    `SELECT o.stripe_subscription_id, o.plan, o.expiration_date
     FROM teachers t JOIN organizations o ON t.organization_id = o.organization_id
     WHERE t.user_id = $1`, [auth.sub]
  );

  if (!org?.stripe_subscription_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  const stripe = getStripe();
  await stripe.subscriptions.update(org.stripe_subscription_id, { cancel_at_period_end: true });

  return NextResponse.json({ success: true, canceled_plan: org.plan, current_expiration: org.expiration_date });
}
