import {
  NextRequest,
  NextResponse
} from 'next/server';
import { db } from '@/db'; // Assuming db is exported from src/db/index.ts
import { users } from '@/db/schema'; // Assuming users table schema is exported from src/db/schema.ts
import { hashPassword } from '@/lib/auth'; // Assuming hashPassword is exported from src/lib/auth.ts
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    // Basic validation
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Full name, email and password are required' }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    await db.insert(users).values({
      fullName,
      email,
      passwordHash: hashedPassword,
      // createdAt and updatedAt will be set by default in schema
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    // Drizzle can throw errors for unique constraints etc.
    if (error.message.includes('UNIQUE constraint failed')) {
       return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
