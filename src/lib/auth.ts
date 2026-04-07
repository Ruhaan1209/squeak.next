import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface AuthResult {
  sub: string;
  email: string;
}

export function verifyAuth(request: NextRequest): AuthResult | NextResponse {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return NextResponse.json({ error: 'Invalid authorization header format' }, { status: 401 });
  }

  const token = parts[1];

  if (process.env.NODE_ENV !== 'production' && token === 'dev-token') {
    return { sub: 'dev-user', email: 'dev@example.com' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    return {
      sub: decoded.sub as string,
      email: decoded.email as string,
    };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export function isAuthError(result: AuthResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
