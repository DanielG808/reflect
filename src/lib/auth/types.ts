export type AuthActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

export type AuthStatus = "unknown" | "loading" | "authed" | "unauth";
