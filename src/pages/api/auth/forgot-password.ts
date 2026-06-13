import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, buildPasswordResetEmail } from '@/lib/email';
import { authRateLimit } from '@/lib/rateLimit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!authRateLimit(req, res)) return;

  const { email } = req.body;

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  // Always respond with the same message to prevent user enumeration
  const safeResponse = () =>
    res.status(200).json({
      message: "If that email is registered, you'll receive a reset link shortly.",
    });

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, password: true },
    });

    // No account → safe no-op (don't reveal existence)
    if (!user) return safeResponse();

    // OAuth-only users have no password — they should use Google sign-in
    if (!user.password) {
      console.log('[ForgotPassword] OAuth-only account, skipping reset for:', user.email);
      return safeResponse();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const host = req.headers.host;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'https';
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    const html = buildPasswordResetEmail(user.name || '', resetUrl);
    const sent = await sendEmail({
      to: user.email,
      subject: 'Reset your TrendLensX password',
      html,
    });

    if (!sent) {
      console.error('[ForgotPassword] Email delivery failed for:', user.email);
    }

    return safeResponse();
  } catch (err) {
    console.error('[ForgotPassword] Error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
