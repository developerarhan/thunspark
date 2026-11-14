import crypto from 'crypto';

/**
 * Hash a plaintext password using Node's native scrypt (memory-hard, NIST recommended).
 * Format: `<salt>:<derivedKey>`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a plaintext password against the scrypt-hashed password.
 * Uses timingSafeEqual to guard against timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');

    if (derivedKey.length !== keyBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}
