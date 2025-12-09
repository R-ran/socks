'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

// 回到顶部按钮组件
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[#d41872] hover:bg-[#b01560] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="回到顶部"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Main Content */}
      <main>{children}</main>

      <Footer />

      {/* 回到顶部按钮 */}
      <ScrollToTopButton />

      {/* 购物车侧边栏 */}
      <CartSidebar />
    </div>
  );
}
