import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

export interface User {
  userID: string;
  username: string;
  accepted: boolean;
  tier: number;
  badges: string[];
  badgeVisibility: boolean;
  msgsent: number;
  heat: number;
  lastDecay: number;
  reputation: number;
  xp: number;
  level: number;
}

export interface Call {
  callId: string;
  channel1Id: string;
  channel2Id: string;
  guild1Id: string;
  guild2Id: string;
  startTime: number;
  endTime: number | null;
  status: 'active' | 'ended';
  messages: number;
  reconnectWindow: number | null;
}

export function rowToUser(row: Record<string, unknown>): User {
  return {
    userID: row.user_id as string,
    username: row.username as string,
    accepted: row.accepted === 1,
    tier: row.tier as number,
    badges: JSON.parse((row.badges as string) || '[]'),
    badgeVisibility: row.badge_visibility === 1,
    msgsent: row.msgsent as number,
    heat: row.heat as number,
    lastDecay: row.last_decay as number,
    reputation: row.reputation as number,
    xp: row.xp as number,
    level: row.level as number,
  };
}
