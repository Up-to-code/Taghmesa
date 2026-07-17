import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return globalForDb.sql ?? postgres(url, { prepare: false, max: 5 });
}

const sql = getClient;

export function getDb() {
  const client = sql();
  if (process.env.NODE_ENV !== "production") globalForDb.sql = client;
  return drizzle(client, { schema });
}
