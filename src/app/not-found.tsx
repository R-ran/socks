'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // 3秒后自动跳转到主页
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl md:text-8xl font-bold text-[#543313] mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[#543313] mb-4">Page Not Found</h2>
          <p className="text-lg text-[#543313] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-[#543313]/70 mb-6">
            Redirecting to homepage in 3 seconds...
          </p>
          <Link
            href="/"
            className="inline-block bg-[#add9a0] hover:bg-[#9ac98c] border-2 border-[#543313] text-[#543313] px-8 py-3 rounded-full font-bold text-lg transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
}

