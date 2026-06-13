import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth — only registered when credentials are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || user.frozen) return null;
          if (!user.password) return null;

          const passwordValid = await bcrypt.compare(credentials.password, user.password);
          if (!passwordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (err) {
          console.error('[Auth] Credentials authorize error:', err);
          return null;
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }) {
      // Only intercept Google OAuth — credentials flow is handled in authorize()
      if (account?.provider !== 'google') return true;

      if (!user.email) {
        console.error('[Auth] Google sign-in: no email returned from Google');
        return false;
      }

      console.log('[Auth] Google sign-in: processing for', user.email);

      // Step 1 — look up or create the user
      let dbUser: { id: string } | null = null;

      try {
        dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });
        console.log('[Auth] Google sign-in: user lookup complete, found:', !!dbUser);
      } catch (err) {
        console.error('[Auth] Google sign-in: user lookup failed:', err);
        return false;
      }

      if (!dbUser) {
        try {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              role: 'user',
              emailVerified: new Date(),
            },
            select: { id: true },
          });
          console.log('[Auth] Google sign-in: new user created, id:', dbUser.id);
        } catch (err) {
          console.error('[Auth] Google sign-in: user creation failed:', err);
          return false;
        }
      } else {
        // Backfill profile image if missing
        if (!user.image) {
          // nothing to update
        } else {
          try {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { image: user.image },
            });
          } catch (err) {
            // Non-fatal — just log it
            console.warn('[Auth] Google sign-in: image backfill failed (non-fatal):', err);
          }
        }
      }

      // Step 2 — link the OAuth account record
      try {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            id_token: account.id_token,
          },
          create: {
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state ?? null,
          },
        });
        console.log('[Auth] Google sign-in: account linked successfully');
      } catch (err) {
        console.error('[Auth] Google sign-in: account link failed:', err);
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      // On first sign-in, `user` is populated — stamp it into the token
      if (user) {
        token.role = (user as any).role ?? 'user';
        token.id = user.id;
        return token;
      }

      // On subsequent requests, refresh role + frozen status from DB
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, frozen: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
            if (dbUser.frozen) {
              console.warn('[Auth] JWT: account is frozen for', token.email);
              return { ...token, error: 'AccountFrozen' };
            }
          }
        } catch (err) {
          // Non-fatal: return existing token so the session doesn't break
          console.error('[Auth] JWT refresh error (non-fatal):', err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? 'user';
        if (token.error) {
          (session as any).error = token.error;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
