# 多人在线五子棋游戏 - 完整启动脚本
# 同时启动游戏服务器和内网穿透

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  多人在线五子棋游戏启动器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectDir\board-game-app"

# 检查ngrok是否存在
if (!(Test-Path "ngrok.exe")) {
    Write-Host "错误: 找不到 ngrok.exe" -ForegroundColor Red
    Write-Host "请确保 ngrok.exe 在 board-game-app 目录中" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "正在启动游戏服务器..." -ForegroundColor Green

# 启动游戏服务器（后台）
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 2

Write-Host "游戏服务器已启动！" -ForegroundColor Green
Write-Host "本地访问地址: http://localhost:3002" -ForegroundColor Yellow
Write-Host ""

Write-Host "正在启动 ngrok 内网穿透..." -ForegroundColor Green
Write-Host "稍等片刻，正在生成公网访问地址..." -ForegroundColor Yellow

# 在新窗口启动 ngrok
$ngrokJob = Start-Process -FilePath "ngrok.exe" -ArgumentList "http 3002" -WindowStyle Normal -PassThru

# 等待 ngrok 启动
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务已全部启动！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "本地访问地址: http://localhost:3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "获取公网地址方法:" -ForegroundColor Cyan
Write-Host "1. 在弹出的 ngrok 窗口中找到 'Forwarding' 开头的地址" -ForegroundColor White
Write-Host "2. 地址格式类似: https://xxxx-xx-xx-xx-xx.ngrok.io" -ForegroundColor Yellow
Write-Host "3. 将这个地址分享给朋友，他们就可以加入游戏了！" -ForegroundColor Green
Write-Host ""
Write-Host "注意:" -ForegroundColor Red
Write-Host "- 请保持两个窗口都打开，不要关闭" -ForegroundColor White
Write-Host "- ngrok 免费版地址会在每次重启后变化" -ForegroundColor Yellow
Write-Host "- 如需重新启动，请先关闭所有窗口再运行此脚本" -ForegroundColor White
Write-Host ""
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray

# 等待用户中断
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "正在停止服务..." -ForegroundColor Yellow
    try {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    } catch {}
    try {
        Stop-Process -Id $ngrokJob.Id -Force -ErrorAction SilentlyContinue
    } catch {}
    Write-Host "服务已停止" -ForegroundColor Red
}
