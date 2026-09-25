import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";

export const handler = {
  async POST(req: Request) {
    const form = await req.formData();
    const email = (form.get("email") ?? "").toString().trim();
    const token = form.get("cf-turnstile-response");

    // 基本邮箱格式校验
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response("请输入正确的邮箱地址", {
        status: 400,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // Turnstile 人机验证
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
      return new Response("人机验证失败，请重试 [错误码: " + JSON.stringify(result["error-codes"]) + "]", {
        status: 403,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // TODO: 这里可以把 email 存到数据库/表格，实现真正的注册
    return new Response("注册成功！欢迎加入 🎮 邮箱：" + email, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};

export default function Register({ url }: PageProps) {
  const error = url.searchParams.get("error");
  return (
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </Head>
      <h1 class="text-3xl font-bold mb-2">邮箱注册</h1>
      <p class="mb-8 text-gray-400">注册后可保存游戏进度</p>
      {error && <p class="mb-4 text-red-400">{error}</p>}
      <form method="POST" action="/register" class="w-full max-w-xs flex flex-col gap-4">
        <input
          type="email"
          name="email"
          required
          placeholder="请输入邮箱地址"
          class="px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:border-pink-500 outline-none"
        />
        <div class="cf-turnstile" data-sitekey="0x4AAAAAAE94JmZM0XJ7hwkd" />
        <button type="submit" class="px-4 py-3 rounded bg-pink-600 hover:bg-pink-500 font-bold">
          注册
        </button>
      </form>
      <a href="/" class="mt-8 text-gray-400 underline text-sm">返回首页</a>
    </div>
  );
}
