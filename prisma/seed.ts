import { prisma } from './client';

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin.trendlensx@gmail.com' },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin.trendlensx@gmail.com',
        name: 'TrendLensX Admin',
        image: '/images/authors/default.jpg',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin account seeded: admin.trendlensx@gmail.com');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });