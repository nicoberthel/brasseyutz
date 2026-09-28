import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { beforeEach } from 'vitest';

process.env.SESSION_SECRET = 'test-secret-0123456789abcdef-0123456789abcdef';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('test-password', 4);
process.env.SITE_URL = 'https://www.brasseyutz.fr';

beforeEach(async () => {
  process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'by-test-'));
  const db = await import('@/lib/db').catch(() => null);
  db?.resetDbForTests?.();
});
