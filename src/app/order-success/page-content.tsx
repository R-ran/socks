'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get('amount');
  const paymentMethod = searchParams.get('paymentMethod') || 'card';

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border-4 border-[#543313] p-8 md:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#543313] mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-lg text-[#543313] mb-6">
              Thank you for your purchase. Your order has been successfully processed.
            </p>

            {amount && (
              <div className="mb-6 p-4 bg-[#e8e0ca] rounded-lg">
                <p className="text-sm text-[#543313] mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-[#543313]">${parseFloat(amount).toFixed(2)}</p>
                {paymentMethod === 'paypal' && (
                  <p className="text-xs text-[#543313] mt-2">Paid via PayPal</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-[#543313]">
                You will receive an email confirmation shortly with your order details.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  href="/"
                  className="bg-[#543313] hover:bg-[#3d2510] text-white py-3 px-8 rounded-full font-bold transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/order-tracking"
                  className="bg-[#e8e0ca] hover:bg-[#ddd5c0] border-2 border-[#543313] text-[#543313] py-3 px-8 rounded-full font-bold transition-colors"
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

