
@echo off
:: AutoGen Studio 快捷启动器
title AutoGen Studio Launcher

:: 以管理员权限重新运行（可选）
:: if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

echo ========================================
echo    AutoGen Studio 启动中...
echo ========================================
echo.

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 调用 PowerShell 脚本启动
powershell -ExecutionPolicy Bypass -File "start_autogen.ps1"

if %errorlevel% neq 0 (
    echo.
    echo 启动失败！按任意键关闭...
    pause >nul
)

