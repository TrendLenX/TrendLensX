import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const achievements = [
  {
    id: 'first-session',
    name: 'First Steps',
    description: 'Complete your first reading session',
    icon: 'book-open',
    category: 'Reading',
    requirement: 1,
    metric: 'sessions',
    points: 10,
    rarity: 'common' as const,
  },
  {
    id: 'five-sessions',
    name: 'Getting Started',
    description: 'Complete 5 reading sessions',
    icon: 'star',
    category: 'Reading',
    requirement: 5,
    metric: 'sessions',
    points: 25,
    rarity: 'common' as const,
  },
  {
    id: 'ten-sessions',
    name: 'Dedicated Reader',
    description: 'Complete 10 reading sessions',
    icon: 'trophy',
    category: 'Reading',
    requirement: 10,
    metric: 'sessions',
    points: 50,
    rarity: 'rare' as const,
  },
  {
    id: 'first-hour',
    name: 'Time Well Spent',
    description: 'Read for 1 hour total',
    icon: 'clock',
    category: 'Time',
    requirement: 60,
    metric: 'minutes',
    points: 20,
    rarity: 'common' as const,
  },
  {
    id: 'five-hours',
    name: 'Deep Diver',
    description: 'Read for 5 hours total',
    icon: 'target',
    category: 'Time',
    requirement: 300,
    metric: 'minutes',
    points: 75,
    rarity: 'rare' as const,
  },
  {
    id: 'ten-hours',
    name: 'Knowledge Seeker',
    description: 'Read for 10 hours total',
    icon: 'award',
    category: 'Time',
    requirement: 600,
    metric: 'minutes',
    points: 150,
    rarity: 'epic' as const,
  },
  {
    id: 'first-goal',
    name: 'Goal Setter',
    description: 'Complete your first reading goal',
    icon: 'target',
    category: 'Goals',
    requirement: 1,
    metric: 'goals_completed',
    points: 30,
    rarity: 'rare' as const,
  },
  {
    id: 'goal-master',
    name: 'Goal Master',
    description: 'Complete 5 reading goals',
    icon: 'trophy',
    category: 'Goals',
    requirement: 5,
    metric: 'goals_completed',
    points: 100,
    rarity: 'epic' as const,
  },
];

async function main() {
  console.log('Seeding achievements...');

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: achievement,
      create: achievement,
    });
  }

  console.log('Achievements seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });