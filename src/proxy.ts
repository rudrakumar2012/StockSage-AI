import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

// IMPORTANT: JWT_SECRET should be loaded from environment variables
// Ensure process.env.JWT_SECRET is set securely in your production environment.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'a_fallback_super_secret_key_for_development_only'
);

// Define paths that require authentication
const protectedRoutes = [
  '/dashboard',
  // Add other protected routes here
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for token in cookies (for page requests) and Authorization header (for API requests)
    const token = 
      request.cookies.get('authToken')?.value || 
      request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      // If no token, redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the JWT
      await jwtVerify(token, JWT_SECRET);

      // If token is valid, allow the request to proceed
      return NextResponse.next();

    } catch (error) {
      // If token is invalid or expired, redirect to login page
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If the route is not protected, allow the request to proceed
  return NextResponse.next();
}
