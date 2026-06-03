@echo off
chcp 65001 > nul
echo ========================================
echo    更新 Vercel API 地址
echo ========================================
echo.
set /p RENDER_URL="请输入你的 Render 后端地址 (例如: https://my-api.onrender.com): "

:: 更新 vercel.json
echo.
echo 正在更新 vercel.json...
powershell -Command "(Get-Content vercel.json) -replace 'https://your-render-backend.onrender.com', '%RENDER_URL%' | Set-Content vercel.json"

:: 更新 .env.example
echo 正在更新 .env.example...
powershell -Command "(Get-Content .env.example) -replace 'https://restaurant-order-api.onrender.com/api', '%RENDER_URL%/api' | Set-Content .env.example"

echo.
echo ========================================
echo    ✅ 配置已更新！
echo ========================================
echo.
echo 接下来：
echo 1. 将更新后的代码推送到 GitHub
echo 2. Vercel 会自动重新部署
echo.
echo 或者手动在 Vercel 中更新环境变量：
echo VITE_API_URL = %RENDER_URL%/api
echo.

pause
