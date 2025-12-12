# 支付环境变量配置说明

## 完整环境变量列表

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```env
# ============================================
# Stripe 支付配置（Visa/Mastercard 等）
# ============================================
# 从 https://dashboard.stripe.com/test/apikeys 获取
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_你的公开密钥
STRIPE_SECRET_KEY=sk_test_你的秘密密钥

# ============================================
# Apple Pay 配置
# ============================================
# Apple Pay 商户标识符
# 格式：merchant.com.yourdomain
# 需要在 Apple Developer 中注册并配置
APPLE_PAY_MERCHANT_ID=merchant.com.animalsox

# ============================================
# 连连国际支付配置
# ============================================
# 连连支付商户号（从连连支付商户后台获取）
LIANLIAN_MERCHANT_ID=你的连连商户号

# 连连支付密钥（从连连支付商户后台获取）
LIANLIAN_SECRET_KEY=你的连连支付密钥

# 连连支付 API 地址（可选，默认使用生产环境）
# 测试环境：https://test-api.lianlianpay.com
# 生产环境：https://api.lianlianpay.com
LIANLIAN_API_URL=https://test-api.lianlianpay.com

# ============================================
# PayPal 配置（可选）
# ============================================
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的PayPal客户端ID

# ============================================
# 应用基础配置（可选）
# ============================================
# 用于支付回调 URL，本地开发使用 localhost:3000
# 生产环境使用实际域名
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Apple Pay 环境变量详解

### APPLE_PAY_MERCHANT_ID

**说明：** Apple Pay 商户标识符

**格式：** `merchant.com.yourdomain`

**获取步骤：**

1. 注册 Apple Developer 账号（https://developer.apple.com/）
2. 在 Apple Developer 中创建 Merchant ID
3. 配置 Merchant ID 的支付处理证书
4. 将 Merchant ID 添加到环境变量

**注意事项：**
- 必须以 `merchant.` 开头
- 需要与您的域名关联
- 需要在 Apple Developer 中完成配置
- 测试环境可以使用默认值 `merchant.com.animalsox`（仅用于开发测试）

**示例：**
```env
APPLE_PAY_MERCHANT_ID=merchant.com.animalsox
```

## 连连国际支付环境变量详解

### LIANLIAN_MERCHANT_ID

**说明：** 连连支付商户号

**获取步骤：**

1. 注册连连支付商户账号（https://open.lianlianpay.com/）
2. 登录连连支付商户后台
3. 在"商户信息"或"API配置"中获取商户号
4. 将商户号添加到环境变量

**示例：**
```env
LIANLIAN_MERCHANT_ID=2019080812345678
```

### LIANLIAN_SECRET_KEY

**说明：** 连连支付签名密钥

**获取步骤：**

1. 登录连连支付商户后台
2. 进入"API配置"或"安全设置"
3. 获取或设置签名密钥（MD5 密钥）
4. 将密钥添加到环境变量

**注意事项：**
- ⚠️ **不要**将密钥提交到 Git
- 密钥用于生成支付签名，确保安全
- 测试环境和生产环境使用不同的密钥

**示例：**
```env
LIANLIAN_SECRET_KEY=your_secret_key_here
```

### LIANLIAN_API_URL

**说明：** 连连支付 API 地址

**可选值：**
- 测试环境：`https://test-api.lianlianpay.com`
- 生产环境：`https://api.lianlianpay.com`

**默认值：** `https://api.lianlianpay.com`（生产环境）

**示例（测试环境）：**
```env
LIANLIAN_API_URL=https://test-api.lianlianpay.com
```

### NEXT_PUBLIC_BASE_URL

**说明：** 应用的基础 URL，用于生成支付回调地址

**本地开发：**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**生产环境：**
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 环境变量优先级

1. **必需变量（支付功能正常工作）：**
   - `STRIPE_SECRET_KEY` - Stripe 支付必需
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe 支付必需
   - `LIANLIAN_MERCHANT_ID` - 连连支付必需
   - `LIANLIAN_SECRET_KEY` - 连连支付必需

2. **可选变量（有默认值或可选功能）：**
   - `APPLE_PAY_MERCHANT_ID` - 有默认值，可暂时不配置
   - `LIANLIAN_API_URL` - 有默认值
   - `NEXT_PUBLIC_BASE_URL` - 有默认值
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal 功能可选

## 测试环境配置示例

```env
# Stripe 测试密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Apple Pay（使用默认值进行测试）
APPLE_PAY_MERCHANT_ID=merchant.com.animalsox

# 连连支付测试环境
LIANLIAN_MERCHANT_ID=test_merchant_123456
LIANLIAN_SECRET_KEY=test_secret_key_123456
LIANLIAN_API_URL=https://test-api.lianlianpay.com

# 本地开发
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 生产环境配置示例

```env
# Stripe 生产密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_SECRET_KEY=sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Apple Pay（使用真实的 Merchant ID）
APPLE_PAY_MERCHANT_ID=merchant.com.animalsox

# 连连支付生产环境
LIANLIAN_MERCHANT_ID=2019080812345678
LIANLIAN_SECRET_KEY=production_secret_key_here
LIANLIAN_API_URL=https://api.lianlianpay.com

# 生产域名
NEXT_PUBLIC_BASE_URL=https://www.animalsox.com
```

## 配置检查清单

- [ ] 已创建 `.env.local` 文件
- [ ] 已添加 Stripe 测试密钥
- [ ] 已添加 Apple Pay Merchant ID（或使用默认值）
- [ ] 已添加连连支付商户号和密钥
- [ ] 已设置正确的 API URL（测试/生产）
- [ ] 已设置应用基础 URL
- [ ] 已将 `.env.local` 添加到 `.gitignore`
- [ ] 已重启开发服务器

## 安全注意事项

1. ⚠️ **永远不要**将 `.env.local` 文件提交到 Git
2. ⚠️ **永远不要**在前端代码中暴露 Secret Key
3. ✅ 使用环境变量管理敏感信息
4. ✅ 定期轮换 API 密钥
5. ✅ 使用 HTTPS 确保数据传输安全
6. ✅ 在生产环境中使用生产密钥

## 常见问题

### Q: Apple Pay 需要配置什么？

A: 至少需要配置 `APPLE_PAY_MERCHANT_ID`。如果暂时没有 Apple Developer 账号，可以使用默认值 `merchant.com.animalsox` 进行开发测试。

### Q: 连连支付如何获取测试账号？

A: 需要联系连连支付客服或访问连连支付开放平台（https://open.lianlianpay.com/）申请测试账号。

### Q: 环境变量配置后不生效？

A: 确保：
1. 文件名为 `.env.local`（不是 `.env`）
2. 已重启开发服务器
3. 变量名拼写正确
4. 没有多余的空格或引号

### Q: 如何验证环境变量是否正确加载？

A: 可以在代码中临时添加 `console.log(process.env.变量名)` 来检查（注意：不要在生产环境暴露敏感信息）。

