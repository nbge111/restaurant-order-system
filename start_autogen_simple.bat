@echo off
title AutoGen Studio
color 0A

echo ========================================
echo    AutoGen Studio - 多智能体协作平台
echo ========================================
echo.

cd /d "C:\Users\26608\.openclaw\MoneyPrinterTurbo"
.venv\Scripts\python.exe -m autogenstudio.web --host 0.0.0.0 --port 8080

pause