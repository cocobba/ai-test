# Vercel 배포 스크립트 (사다리 게임)
$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot
$nodeBin = (Get-ChildItem "$env:USERPROFILE\.local\node\node-v*" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1).FullName

if (-not $nodeBin) {
  Write-Host "Node.js가 없습니다. https://nodejs.org 에서 설치하거나 관리자 권한으로 winget install OpenJS.NodeJS.LTS 를 실행하세요."
  exit 1
}

$env:Path = "$nodeBin;$env:Path"
Set-Location $ProjectDir

Write-Host "Vercel 로그인이 필요하면 브라우저가 열립니다..."
npx --yes vercel@41.7.0 login

Write-Host "배포 중..."
npx --yes vercel@41.7.0 deploy --prod --yes

Write-Host "완료!"
