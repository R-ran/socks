import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LIANLIAN_SECRET_KEY = process.env.LIANLIAN_SECRET_KEY || '';

// 验证签名
function verifySign(params: Record<string, string>, secretKey: string, receivedSign: string): boolean {
  const { sign, ...paramsWithoutSign } = params;
  const sortedKeys = Object.keys(paramsWithoutSign).sort();
  const signString = sortedKeys
    .map(key => `${key}=${paramsWithoutSign[key]}`)
    .join('&');
  const signStringWithKey = `${signString}&key=${secretKey}`;
  const calculatedSign = crypto.createHash('md5').update(signStringWithKey).digest('hex').toUpperCase();
  return calculatedSign === receivedSign;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证签名
    const isValid = verifySign(body, LIANLIAN_SECRET_KEY, body.sign || '');
    
    if (!isValid) {
      console.error('Invalid signature in LianLian Pay notification');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { no_order, result_pay, money_order, oid_paybill } = body;

    // 处理支付结果
    if (result_pay === 'SUCCESS') {
      // 更新订单状态
      // 在实际实现中，这里应该：
      // 1. 更新数据库中的订单状态
      // 2. 发送确认邮件
      // 3. 更新库存等
      
      console.log('Payment successful:', {
        orderNo: no_order,
        amount: money_order,
        transactionId: oid_paybill,
      });
    }

    // 返回成功响应给连连支付
    return NextResponse.json({
      ret_code: '0000',
      ret_msg: 'success',
    });
  } catch (error: unknown) {
    console.error('Error processing LianLian Pay notification:', error);
    return NextResponse.json(
      { ret_code: '9999', ret_msg: 'error' },
      { status: 500 }
    );
  }
}

