/**
 * Better Auth for The Richmond Veterinary Hospital (server-only).
 *
 * Runs at same-origin `/api/auth/*` with local email + password sign-in (toggle in
 * `./email-password`). Sessions and users live in Postgres when `DATABASE_URL` is
 * set, otherwise in the embedded PGLite database (local development).
 *
 * Off switch: `VITE_AUTH_ENABLED=false` disables auth and resolves a dev user —
 * only valid with no database configured (see `verify.server.ts`).
 *
 * NEVER import this from client code — it pulls in `pg` and server-only Better
 * Auth internals. The client uses `@/lib/auth/client`; components read the user via
 * `@/lib/auth/use-current-user`; server functions get a verified id via
 * `@/lib/auth/middleware`.
 */
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { pgliteDialect } from "./pglite-dialect";

// Kick (and share) PGLite bootstrap as soon as the auth server module loads.
void ensureDbReady();

/**
 * Fallback signing secret for local development only. Held on `globalThis` so an
 * HMR re-eval does not mint a new secret and invalidate existing dev sessions.
 * Production must set `BETTER_AUTH_SECRET`.
 */
const globalAuthRef = globalThis as typeof globalThis & {
  __vetcareAuthDevSecret__?: string;
};
function devAuthSecret(): string {
  globalAuthRef.__vetcareAuthDevSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__vetcareAuthDevSecret__;
}

/** Read an env var, treating empty/whitespace as unset. */
const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

// Explicit off-switch. The deployer sets `VITE_AUTH_ENABLED=true` when it
// provisions auth; set it to "false" to force auth off everywhere (dev user).
const authDisabled = env("VITE_AUTH_ENABLED") === "false";

/** True when sign-in is active (real auth is enforced). */
export const authConfigured = !authDisabled;

// This app's own Better Auth origin. In production set `BETTER_AUTH_URL` to the
// public site URL; otherwise the origin is derived per request from the host and
// validated against `allowedHosts` below.
const explicitBaseURL = env("BETTER_AUTH_URL");
// Local `npm run dev` (port 8080 contract). Browsers may send Origin as any of
// these for the same server — trusting only `localhost` rejects `127.0.0.1` and
// breaks email/password with "Invalid origin".
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];
const baseURL = explicitBaseURL ?? {
  // Include loopback + Vercel hosts so dynamic baseURL resolves for email/password
  // sign-up/sign-in on production and preview deployments.
  allowedHosts: ["localhost", "127.0.0.1", "[::1]", "*.vercel.app"],
  // `auto` → trust both http:// and https:// expansions of allowedHosts
  // (production is https; local dev is http).
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

// Origins Better Auth accepts on credentialed POSTs (sign-up/sign-in, etc.).
// Missing entries here surface as FORBIDDEN "Invalid origin".
// Vercel production + preview hosts must be trusted or sign-up returns "Invalid origin".
const VERCEL_TRUSTED: string[] = ["https://*.vercel.app", "*.vercel.app"];
// Runtime deployment URL (set automatically by Vercel).
const vercelUrl = env("VERCEL_URL");
const vercelOrigin = vercelUrl
  ? vercelUrl.startsWith("http")
    ? vercelUrl.replace(/\/+$/, "")
    : `https://${vercelUrl.replace(/\/+$/, "")}`
  : null;

const trustedOrigins: string[] = [
  ...(explicitBaseURL ? [explicitBaseURL] : []),
  ...(vercelOrigin ? [vercelOrigin] : []),
  ...VERCEL_TRUSTED,
  ...LOCAL_DEV_ORIGINS,
];

const databaseUrl = env("DATABASE_URL");

// Real Postgres when `DATABASE_URL` is set (deployed apps), else the app's
// embedded PGLite (local dev) via a Kysely dialect — so Better Auth persists to the
// SAME DB as app data, including email/password users. Both use the Better Auth
// schema from `migrations/auth/0001_auth.sql`.
const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

/** Session token cookie name. */
export const SESSION_TOKEN_COOKIE = "__Host-vetcare-auth.session_token";

export const auth = betterAuth({
  baseURL,
  // Production sets BETTER_AUTH_SECRET; local dev falls back to a process-stable secret.
  secret: env("BETTER_AUTH_SECRET") ?? devAuthSecret(),
  database,

  // CSRF / origin check for credentialed auth POSTs (email sign-up/sign-in, …).
  // See `trustedOrigins` construction above — must cover production hosts AND
  // local loopback variants, or clients get "Invalid origin".
  trustedOrigins,

  // Cache the session in the short-lived signed `session_data` cookie so reads
  // (incl. the client's `/get-session`) skip the DB — this shrinks the "loading"
  // window and reduces auth flicker. See the `auth` skill for the full
  // flicker-prevention guidance (gate on `isPending`; SSR the session).
  session: { cookieCache: { enabled: true, maxAge: 300 } },

  // Local email/password — toggled only via `./email-password` (not a plugin).
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),

  // `__Host-` prefixed cookies: Secure + Path=/ + no Domain, so no sibling subdomain
  // can set a same-named cookie on this app. Better Auth otherwise uses `__Secure-`,
  // so we drop its auto prefix (`useSecureCookies: false`) and set Secure + the
  // names ourselves. (Browsers allow Secure cookies on `http://localhost`.)
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-vetcare-auth.session_data" },
      account_data: { name: "__Host-vetcare-auth.account_data" },
      dont_remember: { name: "__Host-vetcare-auth.dont_remember" },
    },
  },

  plugins: [
    // Accept `Authorization: Bearer <session-token>` as an alternative to the
    // cookie. Only fires when an Authorization header is present, so the cookie
    // path is unaffected.
    bearer(),

    // Bridges Better Auth's Set-Cookie into TanStack Start responses. MUST be
    // last so it runs after every other plugin's hooks.
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}
