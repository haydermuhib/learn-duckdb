# ══════════════════════════════════════════════════════════════════════════════
#  learn-duckdb — One-Line Installer for Windows (PowerShell)
#  https://github.com/haydermuhib/learn-duckdb
# ══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "🦆 Installing learn-duckdb — Interactive Terminal SQL Learning..." -ForegroundColor Cyan

# 1. Check for uv or install it
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "⚡ uv not found. Installing standalone uv for Windows..." -ForegroundColor Yellow
    irm https://astral.sh/uv/install.ps1 | iex
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

# 2. Install learn-duckdb
Write-Host "📦 Installing learn-duckdb..." -ForegroundColor Cyan
uv tool install --force "git+https://github.com/haydermuhib/learn-duckdb.git"

Write-Host "`n🎉 Installation Complete!" -ForegroundColor Green
Write-Host "You can now launch learn-duckdb from anywhere in PowerShell or Command Prompt:`n" -ForegroundColor Cyan
Write-Host "   learn-duckdb`n" -ForegroundColor Yellow
