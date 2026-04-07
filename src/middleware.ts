import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth is handled client-side via AuthContext + Supabase session.
  // This middleware is a placeholder for future server-side auth checks.
  // Protected route redirection happens in the (learner) and (dashboard) layouts
  // which check for jwtToken from AuthContext.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
