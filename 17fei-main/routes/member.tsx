import { HandlerContext } from "$fresh/server.ts";
import { getMember } from "../lib/auth.ts";

export const handler = {
  async GET(request: Request, ctx: HandlerContext) {
    return ctx.render({ member: await getMember(request) });
  },
};

export default function Member(
  { data }: { data: { member: { email: string } | null } },
) {
  return (
    <>
      <div class="w-full leading-8 p-2 min-h-screen text-shadow bg-pink-400 text-lg text-red-100">
        <div class="max-w-screen-md mx-auto p-4">
          {data.member
            ? (
              <>
                <div>已免费解锁会员内容。</div>
                <div class="text-sm">当前会话：{data.member.email}</div>
                <a class="underline" href="/card_version">选择任务卡版本</a>
              </>
            )
            : (
              <>
                <div>尚未加入会员。</div>
                <a class="underline" href="/join">免费加入会员</a>
              </>
            )}
        </div>
      </div>
    </>
  );
}
