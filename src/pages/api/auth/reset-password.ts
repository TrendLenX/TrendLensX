import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!authRateLimit(req, res)) return;

  const { token, password } = req.body;

  if (!token || typeof token !== 'string' || token.length !== 64) {
    return res.status(400).json({ message: 'Invalid or missing reset token.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
      select: { id: true, resetToken: true, resetTokenExpiry: true },
    });

    if (!user || !user.resetTokenExpiry) {
      return res.status(400).json({ message: 'This reset link is invalid or has already been used.' });
    }

    if (new Date() > user.resetTokenExpiry) {
      // Clean up the expired token
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return res.status(400).json({ message: 'This reset link has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[ResetPassword] Error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
