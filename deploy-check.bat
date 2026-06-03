@echo off
chcp 65001 > nul
echo ========================================
echo    扫码点餐系统 - 部署检查
echo ========================================
echo.

:: 检查必要文件
echo [检查 1/6] 检查必要文件...
set MISSING_FILES=0

if not exist "package.json" (
    echo   ❌ package.json 不存在
    set MISSING_FILES=1
) else (
    echo   ✅ package.json 存在
)

if not exist "vercel.json" (
    echo   ❌ vercel.json 不存在
    set MISSING_FILES=1
) else (
    echo   ✅ vercel.json 存在
)

if not exist "render.yaml" (
    echo   ❌ render.yaml 不存在
    set MISSING_FILES=1
) else (
    echo   ✅ render.yaml 存在
)

if not exist "api\db.ts" (
    echo   ❌ api\db.ts 不存在
    set MISSING_FILES=1
) else (
    echo   ✅ api\db.ts 存在
)

if %MISSING_FILES% equ 1 (
    echo.
    echo [错误] 缺少必要文件，部署可能不完整
    pause
    exit /b 1
)

:: 检查 node_modules
echo.
echo [检查 2/6] 检查依赖安装...
if not exist "node_modules" (
    echo   ⚠️  node_modules 不存在，建议运行: pnpm install
) else (
    echo   ✅ 依赖已安装
)

:: 检查 Git
echo.
echo [检查 3/6] 检查 Git 仓库...
if not exist ".git" (
    echo   ⚠️  尚未初始化 Git 仓库
    echo   运行 deploy-github.bat 来初始化并上传
) else (
    echo   ✅ Git 仓库已初始化
)

:: 检查 package.json 脚本
echo.
echo [检查 4/6] 检查 package.json 脚本...
findstr /C:"\"start\"" package.json >nul
if %errorlevel% equ 0 (
    echo   ✅ start 脚本存在
) else (
    echo   ⚠️  start 脚本可能需要添加
)

:: 检查 Vercel 配置
echo.
echo [检查 5/6] 检查 Vercel 配置...
findstr /C:"VITE_API_URL" vercel.json >nul
if %errorlevel% equ 0 (
    echo   ✅ Vercel API 地址已配置
) else (
    echo   ⚠️  请在 vercel.json 中配置 VITE_API_URL
)

:: 检查后端数据库
echo.
echo [检查 6/6] 检查后端数据库...
findstr /C:"DB_PATH" api\db.ts >nul
if %errorlevel% equ 0 (
    echo   ✅ 数据库路径已配置
) else (
    echo   ⚠️  请确保数据库配置正确
)

echo.
echo ========================================
echo    检查完成！
echo ========================================
echo.

:: 询问是否开始部署
echo 是否开始部署到 GitHub?
echo 1. 是，开始部署
echo 2. 否，稍后手动部署
echo.
set /p CHOICE="请选择 (1/2): "

if "%CHOICE%"=="1" (
    echo.
    echo 正在启动 GitHub 上传脚本...
    call deploy-github.bat
) else (
    echo.
    echo 请手动执行以下步骤：
    echo 1. 运行 deploy-github.bat 上传代码到 GitHub
    echo 2. 访问 https://render.com 部署后端
    echo 3. 访问 https://vercel.com 部署前端
    echo.
    echo 详细说明请查看 DEPLOY.md 文件
    echo.
)

pause
