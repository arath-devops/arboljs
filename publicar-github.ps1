# Publicar ArbolJS en GitHub y activar Pages
# Ejecutar en PowerShell: Set-ExecutionPolicy -Scope Process Bypass; .\publicar-github.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== ArbolJS -> GitHub ===" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git no esta instalado. Descarga: https://git-scm.com/download/win" -ForegroundColor Red
  exit 1
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI (gh) no esta instalado." -ForegroundColor Yellow
  Write-Host "Descarga: https://cli.github.com/" -ForegroundColor Yellow
  Write-Host "Luego ejecuta: gh auth login" -ForegroundColor Yellow
  exit 1
}

gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host "Inicia sesion con: gh auth login" -ForegroundColor Yellow
  exit 1
}

$user = gh api user --jq .login
$repo = "ArbolJS"

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

git add index.html styles.css script.js README.md publicar-github.ps1
git status

$hasCommit = $false
git rev-parse --verify HEAD *> $null
if ($LASTEXITCODE -eq 0) {
  $hasCommit = $true
}

if (-not $hasCommit) {
  git commit -m "Initial commit: arbol de corazones romantico"
} else {
  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git commit -m "Update: arbol de corazones romantico"
  }
}

$hasRemote = $false
git remote get-url origin *> $null
if ($LASTEXITCODE -eq 0) {
  $hasRemote = $true
}

if (-not $hasRemote) {
  Write-Host "Creando repositorio $repo en GitHub..." -ForegroundColor Green
  gh repo create $repo --public --source=. --remote=origin --push
} else {
  Write-Host "Subiendo cambios..." -ForegroundColor Green
  git push -u origin main
}

Write-Host "Activando GitHub Pages..." -ForegroundColor Green
$pagesJson = '{ "source": { "branch": "main", "path": "/" } }'
$pagesJson | gh api "repos/$user/$repo/pages" -X POST --input - 2>$null
if ($LASTEXITCODE -ne 0) {
  $pagesJson | gh api "repos/$user/$repo/pages" -X PUT --input -
}

Write-Host ""
Write-Host "Listo!" -ForegroundColor Green
Write-Host "Comparte esta URL (activa en 1-2 minutos):" -ForegroundColor Cyan
Write-Host "https://$user.github.io/$repo/" -ForegroundColor White
