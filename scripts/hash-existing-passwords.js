// One-time migration: hash every password that is still stored as plaintext.
//
// Usage (from the backend folder, with MONGO_DB_KEY in .env or the shell):
//   node scripts/hash-existing-passwords.js           # dry run, changes nothing
//   node scripts/hash-existing-passwords.js --apply   # hash and save
//
// Safe to run more than once: already-hashed passwords are skipped. Users keep
// logging in with the same password as before.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const { hashPassword, isHashed } = require("../utils/auth");

const apply = process.argv.includes("--apply");

(async () => {
  if (!process.env.MONGO_DB_KEY) {
    console.error("MONGO_DB_KEY is not set");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_DB_KEY);
  const users = await userModel
    .find({})
    .select("+password username")
    .lean();

  let plaintext = 0;
  let hashed = 0;
  let empty = 0;
  for (const u of users) {
    if (!u.password) {
      empty++;
      console.log(`  no password set: ${u.username}`);
      continue;
    }
    if (isHashed(u.password)) {
      hashed++;
      continue;
    }
    plaintext++;
    if (apply) {
      await userModel.updateOne(
        { _id: u._id },
        { $set: { password: await hashPassword(u.password) } }
      );
    }
  }

  console.log(
    `${users.length} users: ${hashed} already hashed, ${plaintext} plaintext, ${empty} without a password`
  );
  console.log(
    apply
      ? `Hashed ${plaintext} passwords.`
      : "Dry run only. Re-run with --apply to hash them."
  );
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
