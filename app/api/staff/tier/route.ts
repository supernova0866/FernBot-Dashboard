import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const discordId = (session.user as Record<string, unknown>).discordId as string;
  if (!isAdmin(discordId)) {
    return NextResponse.json({ error: 'Forbidden — admins only' }, { status: 403 });
  }

  const { targetId, tier } = await req.json();

  if (!targetId || tier === undefined || tier === null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const newTier = Number(tier);
  if (newTier < 0 || newTier > 3 || isNaN(newTier)) {
    return NextResponse.json({ error: 'Invalid tier — must be 0 to 3' }, { status: 400 });
  }

  try {
    const check = await db.execute({
      sql: 'SELECT user_id FROM users WHERE user_id = ?',
      args: [targetId],
    });

    if (!check.rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.execute({
      sql: 'UPDATE users SET tier = ? WHERE user_id = ?',
      args: [newTier, targetId],
    });

    return NextResponse.json({ success: true, targetId, newTier });
  } catch (error) {
    console.error('Tier action error:', error);
    return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
  }
}
