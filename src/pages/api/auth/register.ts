import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { authRateLimit } from '@/lib/rateLimit';
import { sendEmail, buildVerificationEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!authRateLimit(req, res)) return;

  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        verifyToken,
        verifyTokenExpiry,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const host = req.headers.host;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const verifyUrl = `${protocol}://${host}/api/auth/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your TrendLensX email address',
      html: buildVerificationEmail(user.name ?? '', verifyUrl),
    });

    return res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
      verificationSent: true,
      email: user.email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Failed to create account. Please try again.' });
  }
}
