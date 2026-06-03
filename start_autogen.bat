
@echo off
title AutoGen Studio
echo Starting AutoGen Studio...

:: 切换到正确的目录
cd /d "C:\Users\26608\.openclaw\autogen"

:: 检查端口是否被占用
netstat -ano | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo Port 8080 is already in use, killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do taskkill /F /PID %%a >nul 2>&1
)

:: 等待1秒
timeout /t 1 /nobreak >nul

:: 启动 AutoGen Studio 并在后台打开浏览器
echo Starting server...
start /min cmd /c "uv run autogenstudio ui --host 0.0.0.0 --port 8080"

:: 等待3秒让服务启动
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

:: 自动打开浏览器
echo Opening browser...
start "" "http://localhost:8080"

echo.
echo AutoGen Studio is running!
echo Access it at: http://localhost:8080
echo Press Ctrl+C to stop the server.
echo.

:: 保持窗口打开（按任意键关闭）
pause

