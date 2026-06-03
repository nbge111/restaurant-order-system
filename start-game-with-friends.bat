@echo off
cd /d "%~dp0"
echo ========================================
echo   多人在线五子棋游戏
echo ========================================
echo.
echo 正在启动游戏服务器和内网穿透...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0start-game-with-friends.ps1
