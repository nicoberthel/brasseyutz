import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

/* Format maison « scrypt:<sel hex>:<hash hex> » : aucun caractère $, donc
   inaltérable par l'expansion de variables des chargeurs .env (Next,
   docker compose, systemd…). Les hashs bcrypt ($2a/$2b/$2y) restent
   acceptés pour compatibilité. */

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN);
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith('scrypt:')) {
    const [, saltHex, hashHex] = stored.split(':');
    if (!saltHex || !hashHex) return false;
    let salt: Buffer, expected: Buffer;
    try {
      salt = Buffer.from(saltHex, 'hex');
      expected = Buffer.from(hashHex, 'hex');
    } catch {
      return false;
    }
    if (expected.length !== KEYLEN) return false;
    const actual = crypto.scryptSync(password, salt, KEYLEN);
    return crypto.timingSafeEqual(actual, expected);
  }
  if (/^\$2[aby]\$/.test(stored)) return bcrypt.compare(password, stored);
  return false;
}
