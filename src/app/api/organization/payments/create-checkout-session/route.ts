import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: auth.email,
    line_items: [{ price: process.env.STRIPE_CLASSROOM_PRICE_ID, quantity: 1 }],
    success_url: `${request.headers.get('origin') || 'http://localhost:3000'}/settings?success=true`,
    cancel_url: `${request.headers.get('origin') || 'http://localhost:3000'}/settings?canceled=true`,
    metadata: { user_id: auth.sub, type: 'organization' },
  });

  return NextResponse.json({ redirect_url: session.url });
}
