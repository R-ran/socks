'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // 记录错误到控制台（生产环境可以发送到错误追踪服务）
    console.error('Application error:', error);

    // 5秒后自动跳转到主页
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-5xl md:text-7xl font-bold text-[#543313] mb-4">Oops!</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#543313] mb-4">Something went wrong</h2>
          <p className="text-lg text-[#543313] mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-semibold mb-2">Error Details:</p>
              <p className="text-xs text-red-600 break-all">{error.message}</p>
            </div>
          )}
          <p className="text-sm text-[#543313]/70 mb-6">
            Redirecting to homepage in 5 seconds...
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="bg-[#d41872] hover:bg-[#b01560] border-2 border-[#543313] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-block bg-[#add9a0] hover:bg-[#9ac98c] border-2 border-[#543313] text-[#543313] px-8 py-3 rounded-full font-bold text-lg transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

