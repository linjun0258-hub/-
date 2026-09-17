export default function About() {
  return (
    <div class="w-full p-2 leading-8 min-h-screen text-shadow bg-pink-300 text-lg text-red-100">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <div class="leading-8 text-gray-900 max-w-lg mt-8 max-auto">
          会员已改为免费服务端注册，请前往免费加入页面。
        </div>
        <a class="mt-4 rounded bg-pink-600 px-4 py-2" href="/join">
          免费加入会员
        </a>
      </div>
    </div>
  );
}
