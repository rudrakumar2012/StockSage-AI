import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  try {
    const context = getRequestContext();
    
    // Check if context or env is missing (common in local proxy)
    if (!context || !context.env || !(context.env as any).DB) {
      throw new Error("D1 Binding not found");
    }

    return drizzle((context.env as any).DB, { schema });
  } catch (error) {
    console.error("--- Database Connection Error ---");
    console.error("Make sure you are accessing the site via port 8788, NOT 3000.");
    throw error;
  }
}