import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 连连支付配置
const LIANLIAN_MERCHANT_ID = process.env.LIANLIAN_MERCHANT_ID || '';
const LIANLIAN_SECRET_KEY = process.env.LIANLIAN_SECRET_KEY || '';
const LIANLIAN_API_URL = process.env.LIANLIAN_API_URL || 'https://api.lianlianpay.com';

// 生成签名
function generateSign(params: Record<string, string>, secretKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const signStringWithKey = `${signString}&key=${secretKey}`;
  return crypto.createHash('md5').update(signStringWithKey).digest('hex').toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', items, orderNo, returnUrl, notifyUrl } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // 检查是否配置了真实的连连支付
    const isConfigured = LIANLIAN_MERCHANT_ID && LIANLIAN_MERCHANT_ID.trim() !== '' && 
                         LIANLIAN_SECRET_KEY && LIANLIAN_SECRET_KEY.trim() !== '';

    // 生成订单号（如果没有提供）
    const orderNumber = orderNo || `LL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 如果未配置，使用模拟支付模式（用于开发测试）
    if (!isConfigured) {
      console.log('LianLian Pay: Using mock payment mode (credentials not configured)');
      
      // 模拟支付处理延迟（让体验更真实）
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 返回模拟支付成功，直接跳转到成功页面
      const mockPaymentUrl = `/order-success?amount=${amount}&paymentMethod=lianlian&orderNo=${orderNumber}&mock=true`;
      
      return NextResponse.json({
        success: true,
        orderNo: orderNumber,
        paymentUrl: mockPaymentUrl,
        isMock: true,
        note: '当前为模拟支付模式（用于开发测试）。要使用真实的连连支付，请在 .env.local 中配置 LIANLIAN_MERCHANT_ID 和 LIANLIAN_SECRET_KEY。',
      });
    }

    // 如果已配置，构建真实的支付参数（但仍需要实现真实的 API 调用）
    const paymentParams: Record<string, string> = {
      version: '1.0',
      oid_partner: LIANLIAN_MERCHANT_ID,
      sign_type: 'MD5',
      no_order: orderNumber,
      dt_order: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
      name_goods: items?.map((item: { name: string }) => item.name).join(',') || 'Animalsox Products',
      money_order: amount.toFixed(2),
      notify_url: notifyUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lianlian-notify`,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-success?paymentMethod=lianlian`,
      info_order: JSON.stringify({
        items: items || [],
        total: amount,
      }),
    };

    // 生成签名
    const sign = generateSign(paymentParams, LIANLIAN_SECRET_KEY);
    paymentParams.sign = sign;

    // 注意：这里需要调用连连支付的真实 API
    // 当前实现仅为框架，需要根据连连支付 API 文档实现真实的接口调用
    // 参考文档：https://open.lianlianpay.com/
    
    console.log('LianLian Pay: Would call real API with params:', {
      merchantId: LIANLIAN_MERCHANT_ID.substring(0, 10) + '...',
      orderNo: orderNumber,
      amount: amount.toFixed(2),
    });
    
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 返回模拟的支付 URL（实际应该从 API 响应中获取）
    const mockPaymentUrl = `/order-success?amount=${amount}&paymentMethod=lianlian&orderNo=${orderNumber}&mock=true`;
    
    return NextResponse.json({
      success: true,
      orderNo: orderNumber,
      paymentUrl: mockPaymentUrl,
      isMock: true, // 标识这是模拟支付（即使配置了，也需要实现真实 API 调用）
      note: '已配置连连支付，但需要实现真实的 API 调用。当前为模拟模式。',
    });
  } catch (error: unknown) {
    console.error('Error processing LianLian Pay:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process LianLian Pay payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// 支付回调处理
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNo = searchParams.get('no_order');
    const result = searchParams.get('result_pay');
    
    if (result === 'SUCCESS') {
      return NextResponse.redirect(
        new URL(`/order-success?amount=0&paymentMethod=lianlian&orderNo=${orderNo}`, request.url)
      );
    }
    
    return NextResponse.redirect(new URL('/checkouts?error=payment_failed', request.url));
  } catch (error: unknown) {
    console.error('Error handling LianLian Pay callback:', error);
    return NextResponse.redirect(new URL('/checkouts?error=payment_failed', request.url));
  }
}

