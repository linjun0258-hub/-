$ErrorActionPreference = "Stop"

$deno = Get-Command deno -ErrorAction SilentlyContinue
if ($null -eq $deno) {
  $fallback = Join-Path $env:USERPROFILE ".deno\bin\deno.exe"
  if (-not (Test-Path $fallback)) {
    throw "未找到 Deno。请安装 Deno 后重新运行此脚本：https://docs.deno.com/runtime/getting_started/installation/"
  }
  $deno = Get-Item $fallback
}

Set-Location $PSScriptRoot
& $deno.Source task start
