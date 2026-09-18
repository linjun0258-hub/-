#!/usr/bin/env -S deno run -A
import { createHandler } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";

if (!globalThis.__freshHandler) {
  globalThis.__freshHandler = await createHandler(manifest, config);
}

export default async function handler(req: Request) {
  return await globalThis.__freshHandler(req);
}
