import { NextResponse } from 'next/server';

export async function POST() {
  const renderUrl = process.env.RENDER_PING_URL;
  if (!renderUrl) {
    return NextResponse.json({ error: 'RENDER_PING_URL not set' }, { status: 500 });
  }

  try {
    await fetch(`${renderUrl}/ping`);
    return NextResponse.json({ success: true, pingedAt: Date.now() });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json({ error: 'Failed to ping bot' }, { status: 500 });
  }
}
