# 🍽️ 扫码点餐系统 - 一键部署到 Vercel

## ✅ 已完成的工作

我已为您配置了完整的 **Vercel Edge Functions** 方案，无需绑定信用卡！

### 📁 项目结构
- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Vercel Edge Functions（全免费）
- **数据存储**: Vercel KV（可选，免费额度可用）

---

## 🚀 一键部署到 Vercel

### 第一步：推送到 GitHub

如果还没推送代码，请运行：
```bash
cd C:\Users\26608\.openclaw
git add .
git commit -m "Update Edge Functions"
git push
```

### 第二步：部署到 Vercel

1. **打开浏览器**: https://vercel.com
2. **登录**: 使用 GitHub 账号登录
3. **导入项目**: 
   - 点击 "Add New..." → "Project"
   - 选择您的仓库 `restaurant-order-system`
4. **配置环境变量**（可选）:
   - 点击 "Environment Variables"
   - 添加 `KV_URL` 和 `KV_REST_API_URL`（如果使用 Vercel KV）
5. **部署**:
   - 点击 "Deploy"
   - 等待 1-2 分钟完成部署
6. **获得地址**: 部署成功后获得您的专属 URL

---

## 📱 访问地址

部署成功后：

| 地址 | 用途 |
|------|------|
| `https://your-project.vercel.app` | 客人扫码点餐 |
| `https://your-project.vercel.app/admin/login` | 商家管理后台 |

**默认商家账号**:
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

## ⚙️ 配置说明

### API 路由

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/categories` | GET | 获取菜单分类 |
| `/api/menu` | GET | 获取菜品列表 |
| `/api/menu?category_id=1` | GET | 按分类获取菜品 |
| `/api/orders` | GET | 获取所有订单 |
| `/api/orders` | POST | 创建新订单 |
| `/api/orders/:id` | GET | 获取订单详情 |
| `/api/orders/:id` | PUT | 更新订单状态 |
| `/api/auth/login` | POST | 商家登录 |
| `/api/auth/verify` | GET | 验证 token |

---

## 💡 提示

1. **数据持久化**: 首次部署后，订单数据会存储在内存中。如需持久化，在 Vercel 控制台启用 KV 存储。
2. **免费额度**: Vercel Edge Functions 提供每月 125K 次免费调用，足够餐厅日常使用。
3. **自定义域名**: 可以在 Vercel 中绑定自己的域名。

---

**🎉 祝您的餐厅生意兴隆！**
