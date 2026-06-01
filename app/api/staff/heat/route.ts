import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isMod } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const discordId = (session.user as Record<string, unknown>).discordId as string;
  if (!isMod(discordId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { targetId, action, amount } = await req.json();

  if (!targetId || !action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT heat, last_decay FROM users WHERE user_id = ?',
      args: [targetId],
    });

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentHeat = result.rows[0].heat as number;

    if (action === 'check') {
      return NextResponse.json({ heat: currentHeat });
    }

    const delta = action === 'add' ? Number(amount) : -Number(amount);
    const newHeat = Math.max(0, currentHeat + delta);

    await db.execute({
      sql: 'UPDATE users SET heat = ?, last_decay = ? WHERE user_id = ?',
      args: [newHeat, Date.now(), targetId],
    });

    return NextResponse.json({ success: true, newHeat, action, targetId });
  } catch (error) {
    console.error('Heat action error:', error);
    return NextResponse.json({ error: 'Failed to update heat' }, { status: 500 });
  }
}
