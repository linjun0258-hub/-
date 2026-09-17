const SESSION_COOKIE = "member_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export interface MemberSession {
  email: string;
  expiresAt: number;
}

function cookieValue(request: Request, name: string): string | undefined {
  const value = request.headers.get("cookie") ?? "";
  return value.split(";").map((item) => item.trim()).find((item) =>
    item.startsWith(`${name}=`)
  )?.slice(name.length + 1);
}

export async function getMember(
  request: Request,
): Promise<MemberSession | null> {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;

  const kv = await Deno.openKv();
  const entry = await kv.get<MemberSession>(["member_sessions", token]);
  if (!entry.value || entry.value.expiresAt < Date.now()) {
    if (entry.value) await kv.delete(["member_sessions", token]);
    return null;
  }
  return entry.value;
}

export async function createMemberSession(email: string): Promise<string> {
  const token = crypto.randomUUID();
  const session = { email, expiresAt: Date.now() + SESSION_TTL_MS };
  const kv = await Deno.openKv();
  await kv.set(["member_sessions", token], session, {
    expireIn: SESSION_TTL_MS,
  });
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
    SESSION_TTL_MS / 1000
  }`;
}

export function deleteSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
