# 🍽️ 扫码点餐系统 - 云端部署完整指南

## ✅ 已完成的工作

我已为您创建了完整的云端部署配置，包括：

### 1. 云平台配置文件
- ✅ `vercel.json` - Vercel 前端部署配置
- ✅ `render.yaml` - Render 后端部署配置
- ✅ `.env.example` - 环境变量示例

### 2. 部署脚本
- ✅ `deploy-github.bat` - 一键上传代码到 GitHub
- ✅ `deploy-check.bat` - 检查部署配置
- ✅ `update-api-url.bat` - 更新 API 地址
- ✅ `.github/workflows/deploy.yml` - 自动部署工作流

### 3. 文档
- ✅ `README.md` - 项目说明
- ✅ `DEPLOY.md` - 详细部署指南

### 4. 数据库升级
- ✅ 已将内存数据库改为 JSON 文件存储
- ✅ 数据持久化，重启不丢失

---

## 🚀 开始部署（5分钟完成）

### 第一步：上传代码到 GitHub

1. 打开终端（在项目目录）
2. 运行命令：
   ```bash
   deploy-github.bat
   ```
3. 按提示输入：
   - GitHub 用户名
   - 仓库名称（如：restaurant-order）

### 第二步：部署后端（Render 免费）

1. 打开浏览器访问：https://render.com
2. 点击 "Sign Up" → 使用 GitHub 登录
3. 点击 "New +" → "Web Service"
4. 连接你的 GitHub 仓库
5. 配置：
   - **Name**: `restaurant-order-api`
   - **Region**: Oregon
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 "Create Web Service"
7. 等待 3-5 分钟部署完成
8. **复制显示的 URL**（如：`https://restaurant-order-api.onrender.com`）

### 第三步：部署前端（Vercel 免费）

1. 打开浏览器访问：https://vercel.com
2. 点击 "Sign Up" → 使用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 导入你的 GitHub 仓库
5. 点击 "Environment Variables"
6. 添加：
   - **Name**: `VITE_API_URL`
   - **Value**: `https://你的Render地址/api`（粘贴第二步的URL + `/api`）
7. 点击 "Deploy"
8. 等待 1-2 分钟部署完成
9. **获得你的前端 URL**（如：`https://restaurant-order.vercel.app`）

### 第四步：更新配置

1. 运行 `update-api-url.bat`
2. 输入你的 Render 后端地址
3. 将更新推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

---

## 📱 访问您的点餐系统

部署成功后，您将拥有：

| 地址 | 用途 |
|------|------|
| `https://你的项目名.vercel.app` | 客人扫码点餐 |
| `https://你的项目名.vercel.app/admin/login` | 商家管理后台 |

**默认商家账号：**
- 用户名：`admin`
- 密码：`123456`

---

## 🎯 使用流程

### 客人点餐
1. 扫描二维码 → 进入点餐页面
2. 选择菜品 → 加入购物车
3. 输入桌号 → 确认订单
4. 提交成功 → 等候上菜

### 商家管理
1. 登录后台 → 查看订单
2. 点击"确认" → 开始制作
3. 点击"完成" → 订单结束
4. 订单实时同步

---

## ⚠️ 重要说明

### 免费额度
- **Render**: 每月750小时（每天可用约25小时）
- **Vercel**: 无限带宽和请求

### 性能注意
- Render 免费版服务在15分钟无请求后会**休眠**
- 首次访问可能需要等待10-30秒唤醒
- **建议**：餐厅营业期间保持后台打开，或升级付费版

### 数据安全
- ✅ 所有订单自动保存到 JSON 文件
- ✅ 服务器重启后数据不丢失
- ⚠️ 如需更高安全性，可升级到付费数据库

---

## 🆘 常见问题

### Q1: 部署失败怎么办？
A: 检查 Render/Vercel 的日志，按错误信息调整配置

### Q2: 手机访问很慢？
A: 这是 Render 免费版的正常现象，建议升级到付费版

### Q3: 如何修改商家密码？
A: 需要手动修改数据库文件中的密码哈希值

### Q4: 订单数据会丢失吗？
A: 不会，数据保存在 Render 的文件系统中

---

## 📞 获取帮助

如有问题，请检查：
1. Render 后端是否正常运行（查看 Logs）
2. Vercel 环境变量是否正确配置
3. 两个服务的 URL 是否匹配

---

**🎉 祝您的餐厅生意兴隆！**
