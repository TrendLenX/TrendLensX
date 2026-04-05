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
      // Get user's reading stats
      const [totalSessions, totalReadingTime, currentStreak] = await Promise.all([
        prisma.readingSession.count({ where: { userId: user.id } }),
        prisma.readingSession.aggregate({
          where: { userId: user.id },
          _sum: { duration: true },
        }),
        // Calculate current reading streak (simplified - consecutive days with sessions)
        prisma.$queryRaw`
          SELECT COUNT(*) as streak
          FROM (
            SELECT DATE(createdAt) as date
            FROM ReadingSession
            WHERE userId = ${user.id}
            GROUP BY DATE(createdAt)
            ORDER BY DATE(createdAt) DESC
            LIMIT 30
          ) dates
          WHERE date >= DATE_SUB(CURDATE(), INTERVAL (ROW_NUMBER() OVER (ORDER BY date DESC) - 1) DAY)
        `,
      ]);

      // Get active goals
      const activeGoals = await prisma.readingGoal.findMany({
        where: {
          userId: user.id,
          completed: false,
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get recent achievements
      const recentAchievements = await prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
        take: 5,
      });

      const progress = {
        totalSessions,
        totalReadingTime: totalReadingTime._sum.duration || 0,
        currentStreak: Array.isArray(currentStreak) && currentStreak[0] ? currentStreak[0].streak : 0,
        activeGoals,
        recentAchievements,
      };

      return res.status(200).json(progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { duration, postId } = req.body;

      if (!duration || duration <= 0) {
        return res.status(400).json({ error: 'Valid duration is required' });
      }

      // Create reading session
      const session = await prisma.readingSession.create({
        data: {
          userId: user.id,
          postId: postId || null,
          startTime: new Date(),
          duration: parseInt(duration),
          completed: true,
          progress: 1.0,
        },
      });

      // Update goals progress
      const activeGoals = await prisma.readingGoal.findMany({
        where: {
          userId: user.id,
          completed: false,
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
      });

      for (const goal of activeGoals) {
        let newProgress = goal.current;

        if (goal.type === 'time') {
          newProgress += parseInt(duration);
        } else if (goal.type === 'articles') {
          newProgress += 1;
        }

        if (newProgress >= goal.target) {
          await prisma.readingGoal.update({
            where: { id: goal.id },
            data: {
              current: goal.target,
              completed: true,
            },
          });
        } else {
          await prisma.readingGoal.update({
            where: { id: goal.id },
            data: { current: newProgress },
          });
        }
      }

      // Check for achievement unlocks
      await checkAndUnlockAchievements(user.id);

      return res.status(201).json(session);
    } catch (error) {
      console.error('Error recording progress:', error);
      return res.status(500).json({ error: 'Failed to record progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function checkAndUnlockAchievements(userId: string) {
  // Get user's stats
  const [totalSessions, totalTime, goalsCompleted] = await Promise.all([
    prisma.readingSession.count({ where: { userId } }),
    prisma.readingSession.aggregate({
      where: { userId },
      _sum: { duration: true },
    }),
    prisma.readingGoal.count({
      where: { userId, completed: true },
    }),
  ]);

  const timeInHours = Math.floor((totalTime._sum.duration || 0) / 60);

  // Define achievement checks
  const achievementChecks = [
    { id: 'first-session', condition: totalSessions >= 1 },
    { id: 'five-sessions', condition: totalSessions >= 5 },
    { id: 'ten-sessions', condition: totalSessions >= 10 },
    { id: 'first-hour', condition: timeInHours >= 1 },
    { id: 'five-hours', condition: timeInHours >= 5 },
    { id: 'ten-hours', condition: timeInHours >= 10 },
    { id: 'first-goal', condition: goalsCompleted >= 1 },
    { id: 'goal-master', condition: goalsCompleted >= 5 },
  ];

  for (const check of achievementChecks) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: check.id },
    });

    if (achievement && check.condition) {
      const existing = await prisma.userAchievement.findFirst({
        where: { userId, achievementId: check.id },
      });

      if (!existing) {
        await prisma.userAchievement.create({
          data: { userId, achievementId: check.id },
        });
      }
    }
  }
}