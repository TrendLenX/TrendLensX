import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  // Dynamically set NEXTAUTH_URL from the incoming request host so it always
  // matches the actual running domain (Replit dev domains rotate).
  // In production this is overridden by the static NEXTAUTH_URL env var.
  if (process.env.NODE_ENV !== 'production') {
    const host = req.headers.host;
    if (host) {
      process.env.NEXTAUTH_URL = `https://${host}`;
    }
  }

  return NextAuth(req, res, authOptions);
}
