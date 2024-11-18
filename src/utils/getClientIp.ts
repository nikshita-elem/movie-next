import { NextRequest } from 'next/server';

/**
 * Extracts the client's IP address from the request headers.
 *
 * @param req - The NextRequest object.
 * @returns The client's IP address as a string, or 'unknown' if it cannot be determined.
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  return 'unknown';
}
