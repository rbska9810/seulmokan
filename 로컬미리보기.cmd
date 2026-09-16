@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $null = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8765/' -TimeoutSec 1 } catch { Start-Process -WindowStyle Hidden -FilePath 'node' -ArgumentList 'scripts/serve.mjs','8765' -WorkingDirectory (Get-Location); Start-Sleep -Seconds 2 }"
start "" "http://127.0.0.1:8765/"
