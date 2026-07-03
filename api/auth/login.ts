import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db.js';
import { signToken, setAuthCookie } from '../_jwt.js';
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
    const user = await prisma.user.findUnique({
      where: { nickname },
      include: {
        settings: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid nickname or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid nickname or password' });
    }

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.status(200).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
