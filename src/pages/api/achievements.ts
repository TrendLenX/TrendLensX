import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      // Get all achievements
      const allAchievements = await prisma.achievement.findMany({
        orderBy: { createdAt: 'asc' },
      });

      // Get user's unlocked achievements
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true },
      });

      const unlockedIds = userAchievements.map(ua => ua.achievementId);

      // Combine achievements with unlock status
      const achievements = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: unlockedIds.includes(achievement.id),
        unlockedAt: userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt,
      }));

      return res.status(200).json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { achievementId } = req.body;

      if (!achievementId) {
        return res.status(400).json({ error: 'Achievement ID is required' });
      }

      // Check if achievement exists
      const achievement = await prisma.achievement.findUnique({
        where: { id: achievementId },
      });

      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }

      // Check if user already has this achievement
      const existing = await prisma.userAchievement.findFirst({
        where: { userId: user.id, achievementId },
      });

      if (existing) {
        return res.status(400).json({ error: 'Achievement already unlocked' });
      }

      // Unlock the achievement
      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId,
        },
        include: { achievement: true },
      });

      return res.status(201).json(userAchievement);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return res.status(500).json({ error: 'Failed to unlock achievement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}