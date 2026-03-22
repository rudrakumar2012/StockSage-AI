import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    // We removed the -wal at the end and swapped to forward slashes
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/cf484200e53006c67c54974dc28ae4e13cd5680de51b367ebc6f361edd938211.sqlite', 
  },
});