import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for casual readers',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Access to basic articles',
      'Email newsletters',
      'Comment on articles',
      'Bookmark articles',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Advanced features for dedicated readers',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'All Basic features',
      'Access to premium articles',
      'Advanced analytics',
      'Reading goals & achievements',
      'Priority support',
      'Ad-free experience',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Complete platform access for power users',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'All Premium features',
      'Early access to new content',
      'Custom newsletter preferences',
      'Advanced search filters',
      'Export reading data',
      'API access',
      'Dedicated account manager',
    ],
  },
];

async function main() {
  console.log('Seeding subscription plans...');

  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log('Subscription plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });