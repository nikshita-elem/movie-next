import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token with the given payload and expiration.
 *
 * @param payload - The payload to include in the token.
 * @param secret - The JWT secret key.
 * @param expiresIn - Token expiration time (e.g., '1h').
 * @returns The generated JWT token as a string.
 */
export function generateToken(
  payload: object,
  secret: string,
  expiresIn: string | number = '1h'
): string {
  return jwt.sign(payload, secret, { expiresIn });
}
