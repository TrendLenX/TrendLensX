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
      const goals = await prisma.readingGoal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      return res.status(500).json({ error: 'Failed to fetch goals' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { type, target, endDate, description } = req.body;

      if (!type || !target) {
        return res.status(400).json({ error: 'Type and target are required' });
      }

      const goal = await prisma.readingGoal.create({
        data: {
          userId: user.id,
          type,
          target: parseInt(target),
          metric: type === 'time' ? 'minutes' : 'articles',
          startDate: new Date(),
          endDate: endDate ? new Date(endDate) : null,
        },
      });

      return res.status(201).json(goal);
    } catch (error) {
      console.error('Error creating goal:', error);
      return res.status(500).json({ error: 'Failed to create goal' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, current, completed } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Goal ID is required' });
      }

      const goal = await prisma.readingGoal.findFirst({
        where: { id, userId: user.id },
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      const updatedGoal = await prisma.readingGoal.update({
        where: { id },
        data: {
          current: current !== undefined ? parseInt(current) : goal.current,
          completed: completed !== undefined ? completed : goal.completed,
        },
      });

      return res.status(200).json(updatedGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
      return res.status(500).json({ error: 'Failed to update goal' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Goal ID is required' });
      }

      await prisma.readingGoal.deleteMany({
        where: { id, userId: user.id },
      });

      return res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      return res.status(500).json({ error: 'Failed to delete goal' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}