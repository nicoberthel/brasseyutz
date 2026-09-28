import bcrypt from 'bcryptjs';

const pw = process.argv[2];
if (!pw) {
  console.error('Usage : node scripts/hash-password.mjs <mot-de-passe>');
  process.exit(1);
}
console.log(bcrypt.hashSync(pw, 12));
