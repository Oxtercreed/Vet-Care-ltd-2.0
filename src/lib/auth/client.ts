import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for this React SPA (browser-side).
 *
 * Talks to this app's own Better Auth at same-origin `/api/auth/*`. Sign in /
 * sign up with email + password via `authClient.signIn.email` /
 * `authClient.signUp.email`. The session rides an HttpOnly cookie.
 *
 * To sign out call `signOut()` below.
 */
export const authClient = createAuthClient({
  fetchOptions: {
    onRequest(ctx) {
      const token = getBearerToken();
      if (token) ctx.headers.set("Authorization", `Bearer ${token}`);
      return ctx;
    },
  },
});

/** True when sign-in is active — i.e. whenever `VITE_AUTH_ENABLED` is not `"false"`. */
export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

const BEARER_KEY = "vetcare-auth.bearer-token";

/** An optional stored bearer token (unset in normal cookie-based use), or null. */
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BEARER_KEY);
  } catch {
    return null;
  }
}

/** Sign out of this app's session, then redirect. Rejects if the server doesn't confirm. */
export async function signOut(redirectTo = "/"): Promise<void> {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message ?? "Sign-out failed");
  try {
    window.sessionStorage.removeItem(BEARER_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
  window.location.href = redirectTo;
}
