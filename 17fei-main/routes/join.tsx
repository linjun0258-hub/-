import { Head } from "$fresh/runtime.ts";
import { HandlerContext } from "$fresh/server.ts";
import { createMemberSession, isSameOrigin } from "../lib/auth.ts";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler = {
  GET(_request: Request, ctx: HandlerContext) {
    return ctx.render({ error: "" });
  },
  async POST(request: Request, ctx: HandlerContext) {
    if (!isSameOrigin(request)) {
      return new Response("Invalid origin", { status: 403 });
    }
    const form = await request.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 254) {
      return ctx.render({ error: "请输入有效邮箱地址。" }, { status: 400 });
    }

    const cookie = await createMemberSession(email);
    return new Response(null, {
      status: 303,
      headers: { location: "/member", "set-cookie": cookie },
    });
  },
};

export default function Join({ data }: { data: { error: string } }) {
  return (
    <>
      <Head>
        <title>免费加入会员</title>
      </Head>
      <main class="min-h-screen bg-pink-400 p-6 text-gray-900">
        <section class="mx-auto max-w-md rounded bg-white p-6 shadow">
          <a href="/" class="text-pink-700 underline">返回首页</a>
          <h1 class="mt-4 text-2xl font-bold">免费加入会员</h1>
          <p class="my-3 text-sm">
            无需支付。仅用邮箱创建登录会话，不发送营销邮件。
          </p>
          <form method="post" class="space-y-3">
            <label class="block">
              邮箱<input
                required
                type="email"
                name="email"
                maxlength="254"
                autocomplete="email"
                class="mt-1 block w-full rounded border p-2"
              />
            </label>
            {data.error && <p class="text-red-700">{data.error}</p>}
            <button
              class="rounded bg-pink-600 px-4 py-2 text-white"
              type="submit"
            >
              免费解锁
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
