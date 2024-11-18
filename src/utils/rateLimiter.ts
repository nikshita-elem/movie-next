import { RateLimiterMemory } from 'rate-limiter-flexible';
import logger from '@/libs/logger';

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of allowed requests
  duration: 60, // Per 60 seconds by IP
});

/**
 * Consumes a point from the rate limiter for the given IP.
 *
 * @param ip - The client's IP address.
 * @returns A promise that resolves if the request is allowed, or rejects if rate limited.
 */
export async function consumeRateLimiter(ip: string): Promise<void> {
  try {
    await rateLimiter.consume(ip);
  } catch (rejRes) {
    logger.warn(rejRes);
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    throw new Error('RateLimitExceeded');
  }
}
