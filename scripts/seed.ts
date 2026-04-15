import { db, pool } from "../server/db";
import { autoSeed } from "../server/auto-seed";
import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function runSeed() {
  console.log("Starting database seed...\n");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log("Session table ready");

    await autoSeed();

    const existing = await storage.getUserByEmail("admin@3dgrillsgenius.com");
    if (!existing) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createUser({
        email: "admin@3dgrillsgenius.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      });
      console.log("Default admin user created: admin@3dgrillsgenius.com / admin123");
    } else {
      console.log("Admin user already exists, skipping");
    }

    console.log("\nSeed completed successfully!");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
