import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import { getUserIdFromReq } from '../_jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = getUserIdFromReq(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { nickname, avatar } = req.body;

  try {
    if (nickname) {
      // Check if another user has this nickname
      const existing = await prisma.user.findFirst({
        where: {
          nickname,
          id: { not: userId }
        }
      });

      if (existing) {
        return res.status(409).json({ error: 'Nickname already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname && { nickname }),
        ...(avatar !== undefined && { avatar })
      }
    });

    return res.status(200).json({
      user: {
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        avatar: updatedUser.avatar,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
