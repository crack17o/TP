# Usage : .\scripts\push-dockerhub.ps1 -User VOTRE_USER [-Tag latest]
param(
    [Parameter(Mandatory = $true)]
    [string]$User,

    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Push-Location $root

Write-Host "Build des images..." -ForegroundColor Cyan
docker build -t "${User}/todo-backend:${Tag}" ./backend
docker build -t "${User}/todo-frontend:${Tag}" ./frontend

Write-Host "Push vers Docker Hub..." -ForegroundColor Cyan
docker push "${User}/todo-backend:${Tag}"
docker push "${User}/todo-frontend:${Tag}"

Write-Host "Termine. Images :" -ForegroundColor Green
Write-Host "  ${User}/todo-backend:${Tag}"
Write-Host "  ${User}/todo-frontend:${Tag}"

Pop-Location
