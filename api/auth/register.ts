import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import { signToken, setAuthCookie } from '../_jwt';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: 'Missing nickname or password' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Nickname already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
        settings: {
          create: {} // Create default settings
        }
      },
      include: {
        settings: true
      }
    });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
