param(
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$clientDir = Join-Path $repoRoot 'client'
$targetPorts = @(3000, 5173)
$apiUrl = 'http://localhost:3000/api/dashboard/config'
$targetLinkTitle = '2F 生產排程甘特圖'

function Stop-NodeOnPort {
  param([int]$Port)

  $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $listeners) {
    Write-Host "[INFO] Port $Port is free."
    return
  }

  foreach ($listener in $listeners) {
    $pid = $listener.OwningProcess
    $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue

    if ($proc -and $proc.ProcessName -eq 'node') {
      Write-Host "[INFO] Stopping node PID $pid on port $Port..."
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      Start-Sleep -Milliseconds 300
    } else {
      $name = if ($proc) { $proc.ProcessName } else { 'unknown' }
      Write-Host "[WARN] Port $Port used by non-node process PID $pid ($name). Skipped."
    }
  }
}

Write-Host "[STEP] 1/4 Clean old ports..."
foreach ($p in $targetPorts) {
  Stop-NodeOnPort -Port $p
}

Write-Host "[STEP] 2/4 Start backend (port 3000)..."
$backendCmd = "Set-Location `"$repoRoot`"; npm run dev:server"
Start-Process -FilePath 'powershell' -ArgumentList @(
  '-NoExit',
  '-NoProfile',
  '-Command',
  $backendCmd
) | Out-Null

Write-Host "[STEP] 3/4 Wait backend and check config links..."
$backendReady = $false
$cfg = $null
for ($i = 1; $i -le 25; $i++) {
  Start-Sleep -Seconds 1
  try {
    $cfg = Invoke-RestMethod -Uri $apiUrl -Method Get -TimeoutSec 2
    $backendReady = $true
    break
  } catch {
    # retry until timeout
  }
}

if ($backendReady) {
  $titles = @($cfg.links | ForEach-Object { $_.title })
  Write-Host "[INFO] Backend ready. Current links:"
  $titles | ForEach-Object { Write-Host " - $_" }

  if ($titles -contains $targetLinkTitle) {
    Write-Host "[OK] Found '$targetLinkTitle'." -ForegroundColor Green
  } else {
    Write-Host "[WARN] '$targetLinkTitle' not found in /api/dashboard/config." -ForegroundColor Yellow
  }
} else {
  Write-Host "[WARN] Backend not ready after timeout. Frontend will still start." -ForegroundColor Yellow
}

Write-Host "[STEP] 4/4 Start frontend (port 5173)..."
$frontendCmd = "Set-Location `"$clientDir`"; npm run dev -- --port 5173 --strictPort"
Start-Process -FilePath 'powershell' -ArgumentList @(
  '-NoExit',
  '-NoProfile',
  '-Command',
  $frontendCmd
) | Out-Null

if (-not $NoBrowser) {
  Start-Sleep -Seconds 2
  Start-Process 'http://localhost:5173/'
}

Write-Host "[DONE] Backend + frontend started."
Write-Host "[TIP] If browser did not open, visit http://localhost:5173/ manually."
