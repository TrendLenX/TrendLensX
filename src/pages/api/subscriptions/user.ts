import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.method === 'GET') {
    try {
      const subscriptions = await prisma.userSubscription.findMany({
        where: { userId: user.id },
        include: {
          plan: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { planId, paymentMethod = 'stripe' } = req.body;

      if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required' });
      }

      // Check if plan exists
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      // Check if user already has an active subscription to this plan
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId: user.id,
          planId,
          status: 'active',
        },
      });

      if (existingSubscription) {
        return res.status(400).json({ error: 'Already subscribed to this plan' });
      }

      // Create subscription
      const startDate = new Date();
      const endDate = new Date(startDate);
      if (plan.interval === 'year') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const subscription = await prisma.userSubscription.create({
        data: {
          userId: user.id,
          planId,
          startDate,
          endDate,
        },
        include: { plan: true },
      });

      // Create payment record (in a real app, this would integrate with Stripe/PayPal)
      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          subscriptionId: subscription.id,
          amount: plan.price,
          currency: plan.currency,
          paymentMethod,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed', // In real app, this would be 'pending' until payment confirms
        },
      });

      return res.status(201).json({
        subscription,
        payment,
        message: 'Subscription created successfully',
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Failed to create subscription' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { subscriptionId, action } = req.body;

      if (!subscriptionId || !action) {
        return res.status(400).json({ error: 'Subscription ID and action are required' });
      }

      const subscription = await prisma.userSubscription.findFirst({
        where: { id: subscriptionId, userId: user.id },
      });

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      let updateData: any = {};

      if (action === 'cancel') {
        updateData = { status: 'canceled', autoRenew: false };
      } else if (action === 'renew') {
        updateData = { autoRenew: true };
      }

      const updatedSubscription = await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: updateData,
        include: { plan: true },
      });

      return res.status(200).json(updatedSubscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}