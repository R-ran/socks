# 支付问题故障排除指南

## Visa 支付失败问题

### 可能的原因和解决方案

#### 1. Stripe 密钥未配置或配置错误

**症状：** 支付时显示 "Payment failed. Please try again."

**检查步骤：**
1. 确认 `.env.local` 文件存在
2. 检查环境变量是否正确设置：
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. 确认密钥以 `test` 开头（测试环境）
4. 重启开发服务器

**解决方案：**
- 从 [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) 获取正确的测试密钥
- 确保密钥完整复制，没有多余空格
- 重启服务器：`npm run dev` 或 `pnpm dev`

#### 2. 使用错误的测试卡号

**正确的测试卡号：**
- **成功支付：** `4242 4242 4242 4242`
- **过期日期：** 任何未来日期（如 `12/25`）
- **CVC：** 任何 3 位数字（如 `123`）

**常见错误：**
- ❌ 使用真实卡号（测试环境不支持）
- ❌ 使用已过期的日期
- ❌ CVC 位数不对

#### 3. 支付金额为 0 或无效

**检查：**
- 购物车中是否有商品
- 订单总金额是否大于 0

#### 4. 查看详细错误信息

现在代码会返回更详细的错误信息，包括：
- 卡错误（Card error）
- 无效请求（Invalid request）
- API 错误（API error）
- 认证错误（Authentication error）

**调试方法：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页，找到 `/api/process-visa-payment` 请求
4. 查看响应中的详细错误信息

## 连连国际支付打不开问题

### 问题分析

从错误信息看，URL 中 `oid_partner=` 为空，说明 `LIANLIAN_MERCHANT_ID` 环境变量未配置。

### 解决方案

#### 1. 配置环境变量

在 `.env.local` 文件中添加：

```env
# 连连支付配置（必需）
LIANLIAN_MERCHANT_ID=你的商户号
LIANLIAN_SECRET_KEY=你的密钥

# 测试环境 API 地址（可选）
LIANLIAN_API_URL=https://test-api.lianlianpay.com

# 或生产环境
# LIANLIAN_API_URL=https://api.lianlianpay.com
```

#### 2. 获取连连支付测试账号

**步骤：**
1. 访问 [连连支付开放平台](https://open.lianlianpay.com/)
2. 注册商户账号
3. 申请测试环境
4. 在商户后台获取：
   - 商户号（Merchant ID）
   - 签名密钥（Secret Key）
   - API 地址

#### 3. 当前实现说明

**重要提示：** 当前代码中的连连支付实现是**演示版本**，需要：

1. **配置真实的商户号和密钥**
2. **实现真实的 API 调用**

当前代码只是构建了支付参数，但没有实际调用连连支付的 API。您需要：

1. 参考 [连连支付 API 文档](https://open.lianlianpay.com/docs)
2. 实现真实的统一下单接口调用
3. 处理 API 响应并获取支付链接

#### 4. 临时解决方案（仅用于开发测试）

如果您暂时没有连连支付账号，可以：

1. **暂时禁用连连支付按钮**，或
2. **使用模拟数据**进行前端测试

## 环境变量检查清单

使用以下命令检查环境变量是否正确加载：

```bash
# 在项目根目录运行
node -e "console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Missing')"
```

或在代码中临时添加（**仅用于调试，不要提交到 Git**）：

```typescript
console.log('Env check:', {
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  hasLianLianMerchant: !!process.env.LIANLIAN_MERCHANT_ID,
});
```

## 常见错误信息对照表

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| "Stripe secret key is not configured" | Stripe 密钥未配置 | 检查 `.env.local` 中的 `STRIPE_SECRET_KEY` |
| "Card error: ..." | 卡号或卡信息错误 | 使用正确的测试卡号 |
| "Invalid request: ..." | 请求参数错误 | 检查卡号、过期日期、CVC 格式 |
| "连连支付商户号未配置" | 商户号未设置 | 配置 `LIANLIAN_MERCHANT_ID` |
| "Payment URL not received" | 支付 URL 获取失败 | 检查连连支付配置和 API 调用 |

## 测试步骤

### Visa 支付测试

1. ✅ 确认环境变量已配置
2. ✅ 重启开发服务器
3. ✅ 添加商品到购物车
4. ✅ 填写测试卡号：`4242 4242 4242 4242`
5. ✅ 填写过期日期：`12/25`
6. ✅ 填写 CVC：`123`
7. ✅ 点击 Visa 按钮或 "Pay now"

### 连连支付测试

1. ✅ 配置 `LIANLIAN_MERCHANT_ID` 和 `LIANLIAN_SECRET_KEY`
2. ✅ 确认 API URL 正确（测试/生产）
3. ✅ 实现真实的 API 调用（当前为演示代码）
4. ✅ 测试支付流程

## 获取帮助

如果问题仍然存在：

1. **检查服务器日志**：查看终端输出的错误信息
2. **检查浏览器控制台**：查看前端错误
3. **检查网络请求**：在浏览器 Network 标签查看 API 响应
4. **验证环境变量**：确认 `.env.local` 文件存在且格式正确

## 下一步

- ✅ Visa 支付：确保 Stripe 密钥正确配置
- ✅ 连连支付：需要实现真实的 API 集成，当前代码仅为框架
- ✅ 建议：先完成 Visa 支付测试，连连支付需要联系连连支付获取测试账号和 API 文档

