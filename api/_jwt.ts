import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only';

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (err) {
    return null;
  }
};

export const setAuthCookie = (res: VercelResponse, token: string) => {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
};

export const clearAuthCookie = (res: VercelResponse) => {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
};

export const getUserIdFromReq = (req: VercelRequest): string | null => {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.auth_token;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};
