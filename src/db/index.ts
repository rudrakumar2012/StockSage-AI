import { drizzle } from 'drizzle-orm/d1';
import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDb() {
  try {
    const context = getRequestContext();
    
    // Fallback check for local development proxy
    if (!context || !context.env || !(context.env as any).DB) {
      console.warn("⚠️ D1 Database binding not found. Ensure you are using port 8788.");
      throw new Error("Cloudflare D1 context missing.");
    }

    return drizzle((context.env as any).DB);
  } catch (error) {
    // This prevents the "Fatal Panic" by handling the error gracefully
    console.error("Critical Database Connection Error:", error);
    throw error;
  }
}