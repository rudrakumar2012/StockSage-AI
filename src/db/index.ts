import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  // Grab the Cloudflare environment
  const { env } = getRequestContext();
  
  // Tell TypeScript to bypass its strict checks for the dynamic 'DB' binding
  const cloudflareEnv = env as any;

  return drizzle(cloudflareEnv.DB, { schema });
}
