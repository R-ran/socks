# 支付功能集成说明

本项目已集成 Stripe 和 PayPal 支付功能。以下是配置步骤：

## 1. 安装依赖

```bash
npm install
```

## 2. 配置环境变量

创建 `.env.local` 文件（不要提交到 Git），添加以下环境变量：

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# PayPal API Keys
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## 3. 获取 Stripe API 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册或登录账户
3. 进入 **Developers** > **API keys**
4. 复制 **Secret key** 和 **Publishable key**
5. 将密钥添加到 `.env.local` 文件中

**注意：**
- 测试环境使用 `sk_test_` 和 `pk_test_` 开头的密钥
- 生产环境使用 `sk_live_` 和 `pk_live_` 开头的密钥

## 4. 获取 PayPal API 密钥

1. 访问 [PayPal Developer Dashboard](https://developer.paypal.com/)
2. 注册或登录账户
3. 创建新的应用或使用现有应用
4. 复制 **Client ID**
5. 将 Client ID 添加到 `.env.local` 文件中

**注意：**
- 测试环境使用 Sandbox 账户的 Client ID
- 生产环境使用 Live 账户的 Client ID

## 5. 支付功能说明

### 支持的支付方式：

1. **Visa/Mastercard/其他信用卡**
   - 通过 Stripe 处理
   - 支持所有主要信用卡品牌

2. **PayPal**
   - 通过 PayPal SDK 处理
   - 用户可以使用 PayPal 账户或信用卡付款

3. **Google Pay**
   - 通过 Stripe 处理（需要额外配置）
   - 目前显示为按钮，完整功能需要额外配置

### 支付流程：

1. 用户在结算页面选择支付方式
2. 点击"Express checkout"按钮选择快速支付
3. 或选择信用卡支付并填写信息
4. 点击"Pay now"完成支付
5. 支付成功后跳转到订单确认页面

## 6. 测试支付

### Stripe 测试卡号：

- **成功支付：** 4242 4242 4242 4242
- **需要 3D Secure：** 4000 0025 0000 3155
- **失败支付：** 4000 0000 0000 0002

其他测试卡号请参考 [Stripe 测试卡号文档](https://stripe.com/docs/testing)

### PayPal 测试：

使用 PayPal Sandbox 账户进行测试：
1. 在 PayPal Developer Dashboard 创建 Sandbox 账户
2. 使用测试账户登录 PayPal 进行支付测试

## 7. 部署到生产环境

1. 将所有测试密钥替换为生产密钥
2. 确保环境变量正确设置
3. 测试所有支付流程
4. 配置 Webhook（如需要）

## 8. 安全注意事项

- **永远不要**将 `.env.local` 文件提交到 Git
- **永远不要**在前端代码中暴露 Secret Key
- 使用 HTTPS 确保支付数据传输安全
- 定期更新 API 密钥
- 监控支付异常和失败情况

## 9. 常见问题

### 支付失败怎么办？

1. 检查环境变量是否正确设置
2. 确认 API 密钥是否正确
3. 查看浏览器控制台和服务器日志
4. 验证订单金额是否正确

### 如何添加更多支付方式？

可以集成其他支付网关，如：
- Apple Pay
- Alipay（支付宝）
- WeChat Pay（微信支付）
- 其他 Stripe 支持的支付方式

## 10. 技术支持

如有问题，请参考：
- [Stripe 文档](https://stripe.com/docs)
- [PayPal 开发者文档](https://developer.paypal.com/docs)

