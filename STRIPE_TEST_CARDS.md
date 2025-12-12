# Stripe 测试卡号

## Visa 支付沙盒测试

在 Stripe 沙盒环境中，您可以使用以下测试卡号来测试 Visa 支付：

### 成功支付的测试卡

| 卡号 | 过期日期 | CVC | 说明 |
|------|---------|-----|------|
| 4242 4242 4242 4242 | 任何未来日期（如 12/25） | 任何 3 位数字（如 123） | 成功支付 |
| 4000 0566 5566 5556 | 任何未来日期 | 任何 3 位数字 | 需要 3D Secure 验证 |
| 4000 0025 0000 3155 | 任何未来日期 | 任何 3 位数字 | 需要 3D Secure 验证 |

### 失败场景的测试卡

| 卡号 | 过期日期 | CVC | 说明 |
|------|---------|-----|------|
| 4000 0000 0000 0002 | 任何未来日期 | 任何 3 位数字 | 卡被拒绝 |
| 4000 0000 0000 9995 | 任何未来日期 | 任何 3 位数字 | 资金不足 |
| 4000 0000 0000 0069 | 任何未来日期 | 任何 3 位数字 | 过期卡 |

### 其他卡类型测试卡

| 卡号 | 类型 | 说明 |
|------|------|------|
| 5555 5555 5555 4444 | Mastercard | 成功支付 |
| 3782 822463 10005 | American Express | 成功支付 |

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
# Stripe 测试密钥（从 https://dashboard.stripe.com/test/apikeys 获取）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
```

## 获取 Stripe 测试密钥步骤

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. 确保在 **Test mode**（测试模式）下
3. 复制 **Publishable key**（以 `pk_test_` 开头）
4. 复制 **Secret key**（以 `sk_test_` 开头）
5. 将密钥添加到 `.env.local` 文件中

## 注意事项

- ⚠️ **不要**将 `.env.local` 文件提交到 Git
- ✅ 测试密钥以 `test` 开头，不会产生真实费用
- ✅ 使用测试卡号不会从真实账户扣款
- ✅ 所有测试交易都会在 Stripe Dashboard 的测试模式中显示

## 测试流程

1. 配置环境变量
2. 重启开发服务器（`npm run dev` 或 `pnpm dev`）
3. 在结算页面填写测试卡号
4. 点击 Visa 按钮进行支付
5. 在 Stripe Dashboard 查看测试交易记录

