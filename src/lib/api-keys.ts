import { randomBytes, createHash } from "crypto";

const KEY_PREFIX = "tpk";

/**
 * Generates a new API key.
 * Returns both the plaintext key (shown to the user exactly once)
 * and the values that get persisted (hash + display prefix).
 */
export function generateApiKey() {
  const secret = randomBytes(24).toString("base64url"); // ~32 chars, URL-safe
  const plaintext = `${KEY_PREFIX}_${secret}`;
  const keyHash = hashApiKey(plaintext);
  const prefix = `${KEY_PREFIX}_${secret.slice(0, 6)}`;

  return { plaintext, keyHash, prefix };
}

export function hashApiKey(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

export function isWellFormedApiKey(value: string): boolean {
  return new RegExp(`^${KEY_PREFIX}_[A-Za-z0-9_-]{20,}$`).test(value);
}
