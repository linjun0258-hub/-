import { Head } from "$fresh/runtime.ts";
import { isSameOrigin } from "../lib/auth.ts";

export const handler = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req: Request, _ctx) {
    if (!isSameOrigin(req)) {
      return new Response("Invalid origin", { status: 403 });
    }
    const form = await req.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const aisex = String(form.get("aisex") ?? "");
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["1", "2"].includes(aisex)
    ) {
      return new Response("Invalid request", { status: 400 });
    }

    const subuser = {
      email,
      aisex,
    };
    const kv = await Deno.openKv();
    await kv.set(["subusers", subuser.email], subuser.aisex);
    return Response.redirect(new URL("/aiok", req.url), 303);
  },
};
export default function AI() {
  return (
    <>
      <Head>
        <title>17fei会员空间</title>
      </Head>
      <div class="w-full leading-8 p-2 min-h-screen text-shadow bg-pink-400 text-lg text-red-100">
        <div class="max-w-screen-md mx-auto p-4">
          <div class="p-2 text-center w-full">
            <a class="block mx-auto" href="/">
              <img src="/logo.png" class="w-12 h-12" />
            </a>

            <div class="text-xs">
              一个AI情侣，懂你，可撩，力所能及的满足各种需求。
            </div>
          </div>
          <form
            class="max-w-md mx-auto border rounded p-4 text-xs bg-blue-50 text-gray-700 mt-4"
            method="POST"
          >
            <div class="flex items-center">
              <div class="w-20">订阅邮箱：</div>
              <input
                name="email"
                class="border rounded p-1"
                placeholder="邮箱"
              />
            </div>
            <div class="flex items-center">
              <div class="w-20">希望获得：</div>
              <select name="aisex" class="text-gray-700 p-1 mt-2">
                <option value="1" checked>
                  女伴侣
                </option>
                <option value="2">男伴侣</option>
              </select>
            </div>
            <div class="mt-2 flex items-center">
              <div class="w-20"></div>
              <button
                class="bg-blue-600 rounded p-1 text-white"
                type="submit"
              >
                登记试用
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
