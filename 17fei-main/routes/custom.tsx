export default function Custom() {
  return (
    <div class="text-shadow min-h-screen w-full bg-pink-300 p-2 text-lg leading-8 text-red-100">
      <div class="mx-auto flex max-w-screen-md flex-col items-center justify-center">
        <div class="flex w-full items-center p-2">
          <a class="flex-1" href="/">
            <img src="/logo.png" class="h-12 w-12" />
          </a>
        </div>
        <div class="max-auto mt-8 max-w-lg leading-8 text-gray-900">
          <div class="text-lg text-gray-500">本网站怎么赚钱</div>
          <div class="my-4">
            这是一个可自行部署和定制的情侣互动小游戏示例。
            <div>
              网站以 Fresh 和 Deno KV 构建；可替换
              Logo、文字和互动内容，形成自己的版本。
            </div>
            <div>
              会员入口现在是免费服务端注册，使用 Deno KV
              保存短期会话，不依赖人工付款。
            </div>
            <p>可根据自己的内容规范与受众需要扩展玩法。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
