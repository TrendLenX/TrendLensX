import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, frequency = 'weekly' } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Check if email is already subscribed
      const existing = await prisma.newsletterSub.findUnique({
        where: { email },
      });

      if (existing) {
        return res.status(400).json({ error: 'Email already subscribed' });
      }

      // Create subscription
      const subscription = await prisma.newsletterSub.create({
        data: {
          email,
          frequency,
        },
      });

      return res.status(201).json({
        message: 'Successfully subscribed to newsletter',
        subscription,
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      await prisma.newsletterSub.updateMany({
        where: { email },
        data: { active: false },
      });

      return res.status(200).json({ message: 'Successfully unsubscribed' });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  }

  // GET method for authenticated users to manage their subscription
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const subscription = await prisma.newsletterSub.findFirst({
        where: { userId: user.id, active: true },
      });

      return res.status(200).json({ subscription });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { frequency } = req.body;
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const subscription = await prisma.newsletterSub.upsert({
        where: { email: session.user.email },
        update: {
          frequency,
          active: true,
          userId: user.id,
        },
        create: {
          email: session.user.email,
          frequency,
          userId: user.id,
        },
      });

      return res.status(200).json({ subscription });
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}