/**
 * Admin seed script.
 *
 * Creates a new admin user, or promotes an existing user (by email) to admin.
 * Credentials are read from environment variables; the password is prompted
 * interactively (masked) if ADMIN_PASSWORD is not provided, so secrets never
 * need to be passed on the command line.
 *
 * Usage:
 *   npm run seed:admin
 *   ADMIN_NAME="Jane" ADMIN_EMAIL="jane@x.com" ADMIN_PASSWORD="secret" npm run seed:admin
 */
require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const User = require('../src/models/User');

function prompt(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer.trim());
  }));
}

// Read a line from stdin without echoing the typed characters.
function promptHidden(query) {
  return new Promise((resolve) => {
    const { Writable } = require('stream');
    // A stdout wrapper that suppresses output while the password is typed.
    const mutableStdout = new Writable({
      write(chunk, encoding, cb) {
        if (!mutableStdout.muted) process.stdout.write(chunk, encoding);
        cb();
      },
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true,
    });

    process.stdout.write(query);
    mutableStdout.muted = true;

    rl.question('', (value) => {
      rl.close();
      process.stdout.write('\n');
      resolve(value.trim());
    });
  });
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('✖  MONGO_URI is not set. Add it to backend/.env before running.');
    process.exit(1);
  }

  const name = process.env.ADMIN_NAME || (await prompt('Admin name: '));
  const email = (process.env.ADMIN_EMAIL || (await prompt('Admin email: '))).toLowerCase();
  const password = process.env.ADMIN_PASSWORD || (await promptHidden('Admin password: '));

  if (!name || !email || !password) {
    console.error('✖  Name, email and password are all required.');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('✖  Password must be at least 6 characters.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email });

  if (user) {
    // Promote and (re)set the password for the existing account.
    user.role = 'admin';
    user.suspended = false;
    user.name = name;
    user.password = password; // re-hashed by the pre-save hook
    await user.save();
    console.log(`✔  Existing user "${email}" promoted to admin and password reset.`);
  } else {
    user = await User.create({ name, email, password, role: 'admin' });
    console.log(`✔  Admin user created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('✖  Failed to seed admin:', err.message);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
