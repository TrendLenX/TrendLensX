import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export function rateLimit(options: { limit?: number; windowMs?: number } = {}) {
  const limit = options.limit ?? 30;
  const windowMs = options.windowMs ?? 60_000;

  return function applyRateLimit(req: NextApiRequest, res: NextApiResponse): boolean {
    const key = `${getClientIp(req)}:${req.url}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= limit) {
      res.setHeader('Retry-After', Math.ceil((entry.resetTime - now) / 1000));
      res.status(429).json({ error: 'Too many requests. Please try again later.' });
      return false;
    }

    entry.count += 1;
    return true;
  };
}

export const authRateLimit = rateLimit({ limit: 10, windowMs: 60_000 });
export const apiRateLimit = rateLimit({ limit: 60, windowMs: 60_000 });
export const uploadRateLimit = rateLimit({ limit: 10, windowMs: 60_000 });
