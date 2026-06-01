import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { db } from './db';

// Load admins and moderators from configdata.json on the bot side
// For the dashboard we check against Turso directly isn't possible for configdata
// so we use env vars to pass admin/mod IDs 
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').filter(Boolean);
const MOD_IDS = (process.env.MOD_IDS || '').split(',').filter(Boolean);

export function isAdmin(userId: string): boolean {
  return ADMIN_IDS.includes(userId);
}

export function isMod(userId: string): boolean {
  return MOD_IDS.includes(userId) || ADMIN_IDS.includes(userId);
}

export function isStaff(userId: string): boolean {
  return isMod(userId);
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: 'identify' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as Record<string, unknown>).id as string;
        token.avatar = (profile as Record<string, unknown>).avatar as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).discordId = token.discordId;
        (session.user as Record<string, unknown>).avatar = token.avatar;
        (session.user as Record<string, unknown>).isAdmin = isAdmin(token.discordId as string);
        (session.user as Record<string, unknown>).isMod = isMod(token.discordId as string);
        (session.user as Record<string, unknown>).isStaff = isStaff(token.discordId as string);
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
