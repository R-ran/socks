'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 15, minutes: 20, seconds: 8 });
  const { getTotalItems, openCart } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Black Friday Banner - 黑色背景 */}
      <div className="bg-black text-white py-3 text-center text-sm">
        <div className="flex items-center justify-center gap-4">
          <span>Black Friday Sale!</span>
          <div className="flex gap-2">
            <div className="countdown-box">
              <div className="text-lg">{countdown.hours}</div>
              <div className="text-xs uppercase">HRS</div>
            </div>
            <div className="countdown-box">
              <div className="text-lg">{countdown.minutes}</div>
              <div className="text-xs uppercase">MIN</div>
            </div>
            <div className="countdown-box">
              <div className="text-lg">{countdown.seconds}</div>
              <div className="text-xs uppercase">SEC</div>
            </div>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-[2px] bg-[#543313]"></div>

      {/* Green Promo Banner */}
      <div className="bg-[#759147] text-black py-2 text-center font-semibold">
        Buy 1, Get 1 Free!
      </div>

      {/* 分隔线 */}
      <div className="h-[2px] bg-[#543313]"></div>

      {/* Navigation */}
      <nav className="bg-[#e8e0ca] py-2 md:py-3 px-4 md:px-6 sticky top-0 z-40 border-b-2 border-[#543313]">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/logo1.png"
                alt="animalsox"
                width={180}
                height={90}
                className="object-contain w-[140px] h-[70px] md:w-[180px] md:h-[90px]"
              />
            </Link>
            {/* 居中的导航链接 - 桌面端 */}
            <div className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="text-[#543313] font-bold hover:opacity-70 text-2xl">Home</Link>
              <Link href="/catalog" className="text-[#543313] font-bold hover:opacity-70 text-2xl">Catalog</Link>
              <Link href="/order-tracking" className="text-[#543313] font-bold hover:opacity-70 text-2xl">Order Tracking</Link>
              <Link href="/contact" className="text-[#543313] font-bold hover:opacity-70 text-2xl">Contact</Link>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="https://accounts.shopify.com/" target="_blank" rel="noopener noreferrer">
                <User className="w-6 h-6 md:w-7 md:h-7 text-[#775136] cursor-pointer hover:opacity-70" />
              </Link>
              <div className="relative cursor-pointer hover:opacity-70" onClick={openCart}>
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-[#775136]" />
                <span className="absolute -top-1 -right-1 bg-[#775136] text-white rounded-full w-5 h-5 md:w-6 md:h-6 text-xs md:text-sm flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              </div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden text-[#775136]"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#543313] pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-[#543313] font-bold hover:opacity-70">Home</Link>
              <Link href="/catalog" className="text-[#543313] font-bold hover:opacity-70">Catalog</Link>
              <Link href="/order-tracking" className="text-[#543313] font-bold hover:opacity-70">Order Tracking</Link>
              <Link href="/contact" className="text-[#543313] font-bold hover:opacity-70">Contact</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

