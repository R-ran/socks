import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    // 检查 Stripe 密钥是否配置
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.trim() === '') {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const { 
      paymentIntentId, 
      cardNumber, 
      expMonth, 
      expYear, 
      cvc, 
      name, 
      email, 
      address 
    } = await request.json();

    if (!paymentIntentId || !cardNumber || !expMonth || !expYear || !cvc) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // 验证卡号格式
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      return NextResponse.json(
        { error: 'Invalid card number length' },
        { status: 400 }
      );
    }

    // 创建支付方式
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumberClean,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
      billing_details: {
        name: name || 'Customer',
        email: email || undefined,
        address: address || undefined,
      },
    });

    // 确认支付
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
    });

    return NextResponse.json({
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    console.error('Error processing Visa payment:', error);
    
    // 如果是 Stripe 错误，返回更详细的错误信息
    if (error instanceof Stripe.errors.StripeError) {
      let errorMessage = error.message;
      
      // 提供更友好的错误信息
      if (error.type === 'card_error') {
        errorMessage = `Card error: ${error.message}`;
      } else if (error.type === 'invalid_request_error') {
        errorMessage = `Invalid request: ${error.message}. Please check your card details.`;
      } else if (error.type === 'api_error') {
        errorMessage = `Payment service error: ${error.message}. Please try again.`;
      } else if (error.type === 'authentication_error') {
        errorMessage = `Authentication error: Please check your Stripe API keys.`;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          type: error.type,
          code: 'code' in error ? (error.code as string) : undefined,
        },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

