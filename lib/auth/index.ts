import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

function createAuth() {
  return betterAuth({
    appName: "Taghmesa Store",
    secret: process.env.BETTER_AUTH_SECRET ?? process.env.SESSION_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["https://www.taghmeesa.sa"],
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    plugins: [admin(), nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;
let auth: Auth | undefined;

export function getAuth() {
  auth ??= createAuth();
  return auth;
}

export type AuthSession = Auth["$Infer"]["Session"];
