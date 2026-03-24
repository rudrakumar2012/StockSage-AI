import {
  NextRequest,
  NextResponse
} from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';

export const runtime = 'edge';

// IMPORTANT: Store JWT_SECRET securely in environment variables (e.g., .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'a_fallback_super_secret_key_for_development_only';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 401 });
    }

    // Verify password
    const isPasswordMatch = await verifyPassword(password, user.passwordHash);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Authentication successful - Generate JWT
    const payload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      subscriptionTier: user.subscriptionTier, // Added tier to token
    };

    // Sign the JWT with the secret key using jose (edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    // Remove password hash from the user object before sending it back
    const { passwordHash, ...userWithoutPassword } = user;

    // Return success message, user info, and the JWT
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: token,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    // Handle potential errors during JWT signing or other operations
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
