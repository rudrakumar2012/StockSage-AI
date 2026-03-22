import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// This forces Drizzle to read your .env.local file
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});