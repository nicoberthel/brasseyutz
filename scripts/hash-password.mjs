import crypto from 'node:crypto';

/* Sortie au format « scrypt:<sel hex>:<hash hex> » — aucun $, donc collable
   tel quel dans .env (Next), docker compose ou systemd sans échappement. */

const pw = process.argv[2];
if (!pw) {
  console.error('Usage : node scripts/hash-password.mjs <mot-de-passe>');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pw, salt, 64);
console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`);
