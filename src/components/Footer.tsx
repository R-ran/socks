'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* 分隔线 */}
      <div className="h-[2px] bg-[#543313]"></div>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6 bg-[#e8e0ca]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row flex-wrap items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="flex-shrink-0">
              <select className="px-4 py-2 rounded-md border-2 border-[#543313] bg-white">
                <option>USD ($)</option>
              </select>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-[#543313] mb-2">
                © 2025, <Link href="/" className="text-[#2d1a0a] hover:opacity-70 underline decoration-2">Animalsox</Link>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Powered by <a href="https://www.shopify.com/?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore" target="_blank" rel="noopener noreferrer" className="text-[#2d1a0a] hover:opacity-70 underline decoration-2">Shopify</a>
              </p>
              <div className="flex gap-4 justify-center text-sm">
                <Link href="/policies/privacy-policy" className="text-[#543313] underline hover:opacity-70">Privacy policy</Link>
                <Link href="/policies/refund-policy" className="text-[#543313] underline hover:opacity-70">Refund policy</Link>
                <Link href="/policies/shipping-policy" className="text-[#543313] underline hover:opacity-70">Shipping policy</Link>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
              <div className="w-20 h-10 bg-white rounded border flex items-center justify-center overflow-hidden px-2">
                <Image
                  src="/apple.png"
                  alt="Apple Pay"
                  width={80}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="w-20 h-10 bg-white rounded border flex items-center justify-center overflow-hidden px-2">
                <Image
                  src="/paypal.png"
                  alt="PayPal"
                  width={80}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="w-20 h-10 bg-white rounded border flex items-center justify-center overflow-hidden px-2">
                <Image
                  src="/google.png"
                  alt="Google Pay"
                  width={80}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="w-20 h-10 bg-white rounded border flex items-center justify-center overflow-hidden px-2">
                <Image
                  src="/visa.png"
                  alt="Visa"
                  width={80}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="w-20 h-10 bg-white rounded border flex items-center justify-center overflow-hidden px-2">
                <Image
                  src="/yinlian.png"
                  alt="银联 Pay"
                  width={80}
                  height={30}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

