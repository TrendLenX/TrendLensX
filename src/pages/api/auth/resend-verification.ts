import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, buildVerificationEmail } from '@/lib/email';
import { authRateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!authRateLimit(req, res)) return;

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' });
  }

  const safeResponse = { message: 'If that account exists and is unverified, a new link has been sent.' };

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true, emailVerified: true, password: true },
    });

    if (!user || user.emailVerified || !user.password) {
      return res.status(200).json(safeResponse);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken: token, verifyTokenExpiry: expiry },
    });

    const host = req.headers.host;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const verifyUrl = `${protocol}://${host}/api/auth/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your TrendLensX email address',
      html: buildVerificationEmail(user.name ?? '', verifyUrl),
    });

    return res.status(200).json(safeResponse);
  } catch (err) {
    console.error('[resend-verification] Error:', err);
    return res.status(200).json(safeResponse);
  }
}
