
# AutoGen Studio 启动脚本
Write-Host "Starting AutoGen Studio..." -ForegroundColor Green

# 切换到工作目录
Set-Location "C:\Users\26608\.openclaw\autogen"

# 检查端口占用
$targetPort = 8080
Write-Host "Checking if port $targetPort is available..." -ForegroundColor Cyan
$netstatOutput = netstat -ano | Select-String ":$targetPort"
if ($netstatOutput) {
    Write-Host "Port $targetPort is in use. Extracting process IDs..." -ForegroundColor Yellow
    $lines = $netstatOutput -split "`n"
    foreach ($line in $lines) {
        if ($line -match "LISTENING") {
            $parts = $line -split '\s+'
            $processId = $parts[-1].Trim()
            if ($processId -and $processId -match '^\d+$') {
                Write-Host "Stopping process $processId..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
    Start-Sleep -Seconds 1
}

# 启动服务器（在后台运行）
Write-Host "Starting server..." -ForegroundColor Cyan
$serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c uv run autogenstudio ui --host 0.0.0.0 --port $targetPort" -WindowStyle Minimized -PassThru

# 等待服务启动
Write-Host "Waiting for server to start (4 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 4

# 自动打开浏览器
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:$targetPort"

Write-Host ""
Write-Host "AutoGen Studio is running!" -ForegroundColor Green
Write-Host "Access it at: http://localhost:$targetPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window (server will continue running)..." -ForegroundColor Gray

# 等待用户按键
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

