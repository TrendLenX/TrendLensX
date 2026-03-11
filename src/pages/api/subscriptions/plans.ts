import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' },
      });

      return res.status(200).json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({ error: 'Failed to fetch plans' });
    }
  }

  // Admin-only operations
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'POST') {
    try {
      const { name, description, price, currency, interval, features } = req.body;

      const plan = await prisma.subscriptionPlan.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          currency,
          interval,
          features: features || [],
        },
      });

      return res.status(201).json(plan);
    } catch (error) {
      console.error('Error creating plan:', error);
      return res.status(500).json({ error: 'Failed to create plan' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}