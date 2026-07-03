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

  const { theme, language, speechRate } = req.body;

  try {
    const updatedSettings = await prisma.settings.update({
      where: { userId },
      data: {
        ...(theme && { theme }),
        ...(language && { language }),
        ...(speechRate !== undefined && { speechRate })
      }
    });

    return res.status(200).json({ settings: updatedSettings });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
