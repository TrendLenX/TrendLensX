import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, email, name, role } = req.body;

  try {
    await prisma.user.create({
      data: {
        id,
        email,
        name,
        role,
        image: null,
      },
    });

    res.status(201).json({ message: 'User synced successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}