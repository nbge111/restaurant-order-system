# 🍽️ 扫码点餐系统

一个现代化的餐厅扫码点餐系统，支持客人扫码点餐和商家订单管理。

## ✨ 功能特性

### 客人端
- 📱 扫码即可点餐，无需下载 APP
- 🛒 购物车功能，支持增减数量
- 📋 订单确认，实时提交
- 💳 支持多种支付方式

### 商家端
- 📊 实时订单看板
- 🔄 订单状态管理（待确认→制作中→完成）
- 📈 销售数据统计
- ⚙️ 菜品管理

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

访问 http://localhost:5173

### 商家登录

- 地址: http://localhost:5173/admin/login
- 用户名: `admin`
- 密码: `123456`

## 🌐 云端部署

### 免费部署方案

本项目支持免费部署到云端，无需购买服务器！

#### 部署步骤

1. **上传代码到 GitHub**
   ```bash
   # 运行部署脚本
   deploy-github.bat
   ```

2. **部署后端到 Render (免费)**
   - 访问 https://render.com
   - 使用 GitHub 登录
   - 创建 Web Service，选择此仓库
   - Build Command: `npm install`
   - Start Command: `npm start`
   - 部署后复制 URL

3. **部署前端到 Vercel (免费)**
   - 访问 https://vercel.com
   - 使用 GitHub 登录
   - 导入此仓库
   - 添加环境变量: `VITE_API_URL = 你的Render地址/api`
   - 部署

4. **更新配置**
   - 运行 `update-api-url.bat`
   - 输入你的 Render 后端地址

### 部署检查

运行 `deploy-check.bat` 检查部署配置是否正确。

## 📁 项目结构

```
.
├── api/                  # 后端 API
│   ├── routes/          # 路由
│   ├── db.ts           # 数据库
│   ├── app.ts          # Express 应用
│   └── server.ts       # 服务器入口
├── src/                 # 前端代码
│   ├── components/     # 组件
│   ├── pages/          # 页面
│   ├── store/          # 状态管理
│   └── services/       # API 服务
├── vercel.json         # Vercel 配置
├── render.yaml         # Render 配置
└── DEPLOY.md           # 部署指南
```

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Express.js + TypeScript
- **数据库**: JSON 文件存储
- **部署**: Vercel + Render

## 📝 使用说明

### 客人点餐
1. 扫描二维码进入点餐页面
2. 选择菜品加入购物车
3. 输入桌号
4. 确认订单并提交

### 商家管理
1. 登录商家后台
2. 查看实时订单
3. 更新订单状态
4. 完成订单

## ⚠️ 注意事项

- 免费版 Render 服务在无请求15分钟后会休眠，首次访问可能需要等待
- 建议餐厅保持后台活跃，或升级到付费版
- 数据每笔订单自动保存，重启后不丢失

## 📄 License

MIT License
