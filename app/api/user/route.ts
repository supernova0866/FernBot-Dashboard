import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rowToUser } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const discordId = (session.user as Record<string, unknown>).discordId as string;

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [discordId],
    });

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rowToUser(result.rows[0] as Record<string, unknown>);
    return NextResponse.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
