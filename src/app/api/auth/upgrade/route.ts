import {
  NextRequest,
  NextResponse
} from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'a_fallback_super_secret_key_for_development_only';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;

    // Update user tier to PRO
    await db.update(users)
      .set({ subscriptionTier: 'PRO' })
      .where(eq(users.id, userId));

    // Fetch updated user
    const updatedUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Upgrade successful',
      user: userWithoutPassword,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
