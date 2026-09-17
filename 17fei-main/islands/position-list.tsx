import { useState } from "preact/hooks";

interface Props {
  positions: string[];
}

function label(encoded: string): string {
  return atob(encoded).split("/").pop()?.replace(
    /-Sex-Position-Illustration|\.jpg|\.jpeg/gi,
    "",
  ).replaceAll("-", " ") ?? "互动卡牌";
}

export default function PositionList({ positions }: Props) {
  const [length] = useState(positions.length);
  return (
    <>
      <div class="grid grid-cols-2 gap-2">
        {positions.map((_position, i) => {
          if (i < length) {
            return (
              <article class="flex min-h-32 items-center justify-center rounded bg-white p-3 text-center text-pink-700 shadow">
                <span>{label(p)}</span>
              </article>
            );
          }
        })}
      </div>
    </>
  );
}
