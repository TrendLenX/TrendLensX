import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, buildNewsletterWelcomeEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';

const newsletterRateLimit = rateLimit({ limit: 5, windowMs: 60 * 60 * 1000 });
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST — subscribe
  if (req.method === 'POST') {
    if (!newsletterRateLimit(req, res)) return;

    const { email, frequency = 'weekly' } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const normalised = email.trim().toLowerCase();
    const safeResponse = { message: 'Thanks! Check your inbox to confirm your subscription.' };

    try {
      const existing = await prisma.newsletterSub.findUnique({ where: { email: normalised } });

      if (existing) {
        if (existing.active) {
          // Silent success — don't leak subscription status
          return res.status(200).json(safeResponse);
        }
        // Re-activate a previously unsubscribed address
        await prisma.newsletterSub.update({
          where: { email: normalised },
          data: { active: true, frequency },
        });
        return res.status(200).json(safeResponse);
      }

      const unsubToken = crypto.randomBytes(24).toString('hex');

      await prisma.newsletterSub.create({
        data: { email: normalised, frequency, unsubToken },
      });

      // Build unsubscribe URL
      const host = req.headers.host;
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const unsubUrl = `${protocol}://${host}/newsletter/unsubscribe?token=${unsubToken}`;

      await sendEmail({
        to: normalised,
        subject: 'Welcome to TrendLensX newsletter! 🎉',
        html: buildNewsletterWelcomeEmail(normalised, unsubUrl),
      });

      return res.status(201).json(safeResponse);
    } catch (err) {
      console.error('[newsletter/subscribe] Error:', err);
      return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
    }
  }

  // DELETE — unsubscribe by email (legacy / user dashboard)
  if (req.method === 'DELETE') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    try {
      await prisma.newsletterSub.updateMany({
        where: { email: email.toLowerCase() },
        data: { active: false },
      });
      return res.status(200).json({ message: 'Successfully unsubscribed' });
    } catch (err) {
      console.error('[newsletter/unsubscribe] Error:', err);
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
