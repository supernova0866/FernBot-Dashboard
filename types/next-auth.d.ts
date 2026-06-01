import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    discordId?: string;
    avatar?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      discordId?: string;
      avatar?: string;
      isAdmin?: boolean;
      isMod?: boolean;
      isStaff?: boolean;
    };
  }
}
