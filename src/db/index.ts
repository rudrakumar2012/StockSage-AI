import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Simple, direct connection to a local file. 
// No proxies, no 8788, no infinite loops.
const client = createClient({ 
  url: 'file:local.db' 
});

export const db = drizzle(client);

// Keep this function signature so your page.tsx doesn't break
export function getDb() {
  return db;
}