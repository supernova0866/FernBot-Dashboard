import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const usersResult = await db.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult.rows[0].count as number;

    const activeCallsResult = await db.execute(
      `SELECT COUNT(*) as count FROM calls WHERE status = 'active'`
    );
    const activeCalls = activeCallsResult.rows[0].count as number;

    const totalCallsResult = await db.execute('SELECT COUNT(*) as count FROM calls');
    const totalCalls = totalCallsResult.rows[0].count as number;

    const msgsResult = await db.execute('SELECT SUM(msgsent) as total FROM users');
    const totalMessages = msgsResult.rows[0].total as number || 0;

    // Unique guilds from all calls
    const guildsResult = await db.execute(
      'SELECT guild1_id, guild2_id FROM calls'
    );
    const guilds = new Set<string>();
    for (const row of guildsResult.rows) {
      if (row.guild1_id) guilds.add(row.guild1_id as string);
      if (row.guild2_id) guilds.add(row.guild2_id as string);
    }

    return NextResponse.json({
      totalUsers,
      activeCalls,
      totalCalls,
      totalMessages,
      registeredServers: guilds.size,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
