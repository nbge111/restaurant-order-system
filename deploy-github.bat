@echo off
chcp 65001 > nul
echo ========================================
echo    扫码点餐系统 - GitHub 上传脚本
echo ========================================
echo.

:: 检查是否安装了 Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 检查是否在项目目录
if not exist "package.json" (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo [1/5] 初始化 Git 仓库...
git init >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git 初始化失败
    pause
    exit /b 1
)

echo [2/5] 添加所有文件...
git add .

echo [3/5] 提交代码...
git commit -m "Initial commit - 扫码点餐系统"

echo.
echo ========================================
echo    请提供以下信息：
echo ========================================
echo.
set /p GITHUB_USER="请输入 GitHub 用户名: "
set /p GITHUB_REPO="请输入仓库名称 (例如: restaurant-order): "

echo [4/5] 设置远程仓库...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GITHUB_USER%/%GITHUB_REPO%.git

echo [5/5] 推送到 GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    ✅ 上传成功！
    echo ========================================
    echo.
    echo 接下来请访问以下链接完成部署：
    echo.
    echo 1. 部署后端到 Render:
    echo    https://render.com
    echo.
    echo 2. 部署前端到 Vercel:
    echo    https://vercel.com
    echo.
    echo 详细步骤请查看 DEPLOY.md 文件
    echo.
) else (
    echo.
    echo [错误] 上传失败，请检查网络连接和仓库权限
)

pause
