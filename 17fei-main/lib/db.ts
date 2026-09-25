// 数据库连接模块 - 使用 PostgreSQL（DATABASE_URL 从环境变量读取）
import postgres from "npm:postgres@3.4.5";

const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (!DATABASE_URL) {
  console.warn("警告: 未设置 DATABASE_URL 环境变量，数据库功能不可用");
}

// 禁用预编译语句缓存（适配 Supabase 等 serverless 环境）
export const sql = postgres(DATABASE_URL ?? "postgres://invalid", {
  prepare: false,
  max: 5,
});

// 自动建表：users 表（id 自增主键、username 唯一、email、password 为 bcrypt 哈希、created_at 注册时间）
let initialized = false;

export async function ensureTables() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  initialized = true;
}
