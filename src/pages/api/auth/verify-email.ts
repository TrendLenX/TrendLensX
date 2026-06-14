import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.redirect('/auth/verify-email?status=invalid');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verifyToken: token },
      select: { id: true, verifyTokenExpiry: true, emailVerified: true },
    });

    if (!user) {
      return res.redirect('/auth/verify-email?status=invalid');
    }

    if (user.emailVerified) {
      return res.redirect('/auth/signin?message=Your email is already verified. Please sign in.');
    }

    if (!user.verifyTokenExpiry || user.verifyTokenExpiry < new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verifyToken: null, verifyTokenExpiry: null },
      });
      return res.redirect('/auth/verify-email?status=expired');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return res.redirect('/auth/signin?message=Email verified! You can now sign in.');
  } catch (err) {
    console.error('[verify-email] Error:', err);
    return res.redirect('/auth/verify-email?status=error');
  }
}
