import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cachedClient: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cachedClient) return cachedClient;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Either set it in .env, or rely on the JSON fallback in lib/data.ts.",
    );
  }

  const queryClient = postgres(url, {
    prepare: false,
    max: 5,
  });
  cachedClient = drizzle(queryClient, { schema });
  return cachedClient;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
