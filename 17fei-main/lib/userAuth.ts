// 用户认证模块：bcrypt 密码哈希 + 签名 Cookie 会话
import { hash, compare } from "https://esm.sh/bcryptjs@2.4.3";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_SECRET = Deno.env.get("SESSION_SECRET") ?? "dev-secret-change-me";

// ---------- 密码哈希（bcrypt，绝不存明文） ----------
export async function hashPassword(plain: string): Promise<string> {
  return await hash(plain);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  try {
    return await compare(plain, hashed);
  } catch {
    return false;
  }
}

// ---------- 会话 Token（HMAC 签名，格式: username.expiry.signature） ----------
function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createSessionToken(username: string, days = 7): string {
  const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = `${username}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expiry, signature] = parts;
  const payload = `${username}.${expiry}`;
  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  if (Number(expiry) < Date.now()) return null;
  return username;
}

// ---------- Cookie 辅助 ----------
export function sessionCookie(token: string): string {
  return `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearSessionCookie(): string {
  return "session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
}

export function getUsernameFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? verifySessionToken(decodeURIComponent(match[1])) : null;
}

// ---------- Turnstile 人机验证 ----------
export async function verifyTurnstile(token: FormDataEntryValue | null): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: Deno.env.get("TURNSTILE_SECRET_KEY"),
      response: token,
    }),
  });
  const result = await res.json();
  return Boolean(result.success);
}
