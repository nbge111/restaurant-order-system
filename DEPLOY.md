# Restaurant Order System - Deploy Guide

# 扫码点餐系统 - 云端部署指南

## 系统架构

```
客人手机 ──→ Vercel (前端免费托管)
              ↓
          API 代理
              ↓
Render (后端免费额度) ←── 商家管理设备
```

## 部署步骤

### 第一步：创建 GitHub 仓库

1. 访问 GitHub: https://github.com
2. 登录后点击右上角 "+" → "New repository"
3. 仓库名称填写: `restaurant-order-system`
4. 选择 Private（私有）
5. 点击 "Create repository"

### 第二步：上传代码到 GitHub

在项目目录下执行：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/restaurant-order-system.git
git push -u origin main
```

### 第三步：部署后端到 Render

1. 访问 Render: https://render.com
2. 点击 "Get Started" 登录（使用 GitHub 账号）
3. 点击 "New +" → "Web Service"
4. 连接你的 GitHub 仓库
5. 配置服务：
   - **Name**: `restaurant-order-api`
   - **Region**: Oregon
   - **Branch**: main
   - **Root Directory**: (留空)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 "Create Web Service"
7. 等待部署完成（约3-5分钟）
8. 部署成功后，复制显示的 URL（如：`https://restaurant-order-api.onrender.com`）

### 第四步：部署前端到 Vercel

1. 访问 Vercel: https://vercel.com
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   - 点击 "Environment Variables"
   - 添加：
     - **Name**: `VITE_API_URL`
     - **Value**: `https://restaurant-order-api.onrender.com/api`（替换为你的 Render URL）
5. 点击 "Deploy"
6. 等待部署完成（约1-2分钟）
7. 部署成功后，获得你的前端 URL（如：`https://restaurant-order-system.vercel.app`）

### 第五步：更新 Vercel 配置

部署完成后需要更新 Vercel 的路由配置：

1. 在 Vercel 项目中找到 `vercel.json` 文件
2. 将其中的 `https://your-render-backend.onrender.com` 替换为你的实际 Render URL
3. 重新部署

## 访问地址

部署成功后，你将获得：

- **客人点餐**: `https://你的项目名.vercel.app`
- **商家管理**: `https://你的项目名.vercel.app/admin/login`
- **默认商家账号**: `admin` / `123456`

## 重要说明

### 免费额度限制

- **Render**: 每月750小时免费，超时服务会休眠
- **Vercel**: 无限带宽和请求，100GB存储

### 数据持久化

系统使用 JSON 文件存储数据，每次创建订单会自动保存。

### 性能优化

免费版的 Render 服务在长时间无请求后会休眠，首次访问可能需要等待10-30秒唤醒。

## 常见问题

### Q: 服务加载很慢？
A: 这是 Render 免费版的正常现象，服务休眠后需要唤醒。建议餐厅高峰期保持后台打开。

### Q: 数据会丢失吗？
A: 不会。所有订单和配置都会保存到 JSON 文件中，重启后数据依然存在。

### Q: 如何修改商家密码？
A: 需要直接修改数据库文件中的密码哈希值。

## 技术支持

如有问题，请检查：
1. Render 后端是否正常运行（查看 Logs）
2. Vercel 环境变量是否正确配置
3. 两个服务的 URL 是否匹配

---

**祝您的餐厅生意兴隆！🍽️**
