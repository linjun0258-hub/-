export const handler = {
  async POST(req: Request) {
    const form = await req.formData();
    const token = form.get("cf-turnstile-response");

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: Deno.env.get("TURNSTILE_SECRET_KEY"),
        response: token,
      }),
    });
    const result = await res.json();

    if (!result.success) {
      return new Response("人机验证失败，请重试 [错误码: " + JSON.stringify(result["error-codes"]) + "]", { status: 403 });
    }
    return new Response("验证通过！欢迎游玩 🎮", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
