import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db.js';
import { getUserIdFromReq } from '../_jwt.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = getUserIdFromReq(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { topicId, vocabulary } = req.body;

  if (topicId === undefined || !vocabulary) {
    return res.status(400).json({ error: 'Missing topicId or vocabulary' });
  }

  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_topicId_vocabulary: {
          userId,
          topicId: Number(topicId),
          vocabulary
        }
      },
      update: {}, // Do nothing if it already exists
      create: {
        userId,
        topicId: Number(topicId),
        vocabulary
      }
    });

    return res.status(200).json({ progress });
  } catch (error) {
    console.error('Sync progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
