import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      tenantId: string;
      roleCode: string;
      isSuperAdmin: boolean;
    } & DefaultSession['user'];
  }
}
