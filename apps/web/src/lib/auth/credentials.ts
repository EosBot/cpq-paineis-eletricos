import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { env } from '@/lib/env';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.user = {
          id: (user as any).id,
          email: user.email ?? '',
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          tenantId: (user as any).tenantId,
          roleCode: (user as any).roleCode,
          isSuperAdmin: (user as any).isSuperAdmin ?? false,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user = token.user as any;
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        tenantId: { label: 'Tenant ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(`${env.INTERNAL_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email as string,
              password: credentials.password as string,
              tenantId: (credentials.tenantId as string) || undefined,
            }),
          });

          if (!response.ok) return null;

          const data = await response.json();
          return {
            id: data.sub ?? '',
            email: (credentials.email as string),
            firstName: '',
            lastName: '',
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tenantId: data.tenantId ?? '',
            roleCode: data.roleCode ?? '',
            isSuperAdmin: data.isSuperAdmin ?? false,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
