'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

// 直线分隔组件
const WaveDivider = ({ topColor, bottomColor }: { topColor: string; bottomColor: string }) => {
  return (
    <div className="relative w-full h-20 overflow-hidden">
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        {/* 上半部分 */}
        <rect x="0" y="0" width="1200" height="50" fill={topColor} />
        {/* 下半部分 */}
        <rect x="0" y="50" width="1200" height="50" fill={bottomColor} />
        {/* 分割线 */}
        <line x1="0" y1="50" x2="1200" y2="50" stroke="#543313" strokeWidth="2" />
      </svg>
    </div>
  );
};

// 图片滑动对比组件
const ImageCompareSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg md:rounded-2xl shadow-xl md:shadow-2xl cursor-ew-resize select-none touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleEnd}
      onTouchEnd={handleEnd}
    >
      {/* 背景图片 - Others */}
      <div className="absolute inset-0">
        <Image
          src="https://ext.same-assets.com/2605587933/2773191183.jpeg"
          alt="Others"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8">
          <span className="bg-[#d41872] text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base">
            Others
          </span>
        </div>
      </div>

      {/* 前景图片 - Us */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src="https://ext.same-assets.com/2605587933/1408584014.jpeg"
          alt="Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-8 md:left-8">
          <span className="bg-[#d41872] text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base">
            Us
          </span>
        </div>
      </div>

      {/* 滑动条 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* 滑动手柄 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#add9a0] border-2 sm:border-4 border-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#543313] sm:w-6 sm:h-6">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 19L16 12L9 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

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

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 首页展示的产品（仅显示名称和图片）
  const homeProducts = [
    { name: 'Sloth', slug: 'sloth-socks', price: '$35.00', image: '/Sloth-Socks3.avif' },
    { name: 'Cat', slug: 'cat-socks', price: '$35.00', image: 'https://ext.same-assets.com/2605587933/1728312560.jpeg' },
    { name: 'Highland Cow', slug: 'highland-cow-socks', price: '$35.00', image: 'https://ext.same-assets.com/2605587933/1408584014.jpeg' },
    { name: 'Red Panda', slug: 'red-panda-socks', price: '$35.00', image: 'https://ext.same-assets.com/2605587933/2037452345.jpeg' },
    { name: 'Cavalier Dog', slug: 'cavalier-dog-socks', price: '$35.00', image: '/Cavalier-Dog3.avif' },
    { name: 'Crocodile', slug: 'crocodile-socks', price: '$35.00', image: 'https://ext.same-assets.com/2605587933/2773191183.jpeg' },
    { name: 'Shark', slug: 'shark-socks', price: '$35.00', image: '/Shark-Socks1.avif' },
  ];

  const bundles = [
    { name: 'Cats and Dogs Bundle', slug: 'cats-and-dogs-bundle', price: '$39.50', image: 'https://ext.same-assets.com/2605587933/2161150651.jpeg' },
    { name: 'Sharks and Crocs Bundle', slug: 'sharks-and-crocs-bundle', price: '$35.00', image: 'https://ext.same-assets.com/2605587933/446626278.jpeg' },
  ];

  const reviews = [
    {
      title: 'Cozy and Adorable!',
      text: "These socks are the comfiest I've ever owned, and the animal...",
      fullText: "These socks are the comfiest I've ever owned, and the animal design makes me smile every time I put them on.",
      author: 'Jessi E.',
      location: 'Texas,CA',
      avatar: '/avatars/jessi-e.jpg' // 在这里添加头像路径
    },
    {
      title: 'Perfect Gift',
      text: 'Got a pair for my sister and she absolutely loved them. Supe...',
      fullText: 'Got a pair for my sister and she absolutely loved them. Super soft and the quality is amazing!',
      author: 'Daniel K.',
      location: 'Londan,UK',
      avatar: '/avatars/daniel-k.jpg' // 在这里添加头像路径
    },
    {
      title: 'My New Chill Socks',
      text: 'I wear them every night when I read on the couch. They feel ...',
      fullText: 'I wear them every night when I read on the couch. They feel so cozy and warm, perfect for relaxing!',
      author: 'Sophie M.',
      location: 'Seattle',
      avatar: '/avatars/sophie-m.jpg' // 在这里添加头像路径
    }
  ];

  const handleReadMore = (index: number) => {
    setSelectedReviewIndex(index);
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#2d5f47] py-12 md:py-20 overflow-hidden" style={{
        backgroundImage: 'url(https://ext.same-assets.com/2605587933/3505472518.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6 relative z-10">
          <p className="text-[#e8e0ca] text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">animalsox</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-8 leading-tight px-2">
            Not Just Socks. A Hug for Your Feet.
          </h1>
          <Link href="/catalog" className="inline-block bg-[#a89bb8] hover:bg-[#9688a8] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg transition-colors">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Wave Divider - Hero to Products */}
      <WaveDivider topColor="#2d5f47" bottomColor="#ffffff" />
      

      {/* Products Section - WHITE BACKGROUND */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-8 md:mb-12 text-center">
            Cozy Toes, Wild Hearts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {homeProducts.map((product, idx) => (
              <Link key={idx} href={`/products/${product.slug}`} className="block">
                <div className="bg-[#f5f5f5] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-[#543313] mb-2">{product.name}</h3>
                    <p className="text-lg text-[#543313]">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 分隔线 */}
      <div className="h-[2px] bg-[#543313]"></div>

      {/* Bundles Section - 米色背景 */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#e8e0ca]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-8 md:mb-12 text-center">
            "Done For You" Christmas Gifts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {bundles.map((bundle, idx) => (
              <Link key={idx} href={`/products/${bundle.slug}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-[#543313] hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="aspect-square relative">
                    <Image
                      src={bundle.image}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center bg-[#e8e0ca]">
                    <h3 className="text-xl font-bold text-[#543313] mb-2">{bundle.name}</h3>
                    <p className="text-lg text-[#543313]">{bundle.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider - Beige to Green */}
      <WaveDivider topColor="#e8e0ca" bottomColor="#add9a0" />

      {/* Scrolling Text Section */}
      <div className="relative w-full overflow-hidden bg-[#add9a0] py-4">
        <div className="flex whitespace-nowrap">
          {/* 第一段文字 */}
          <div className="inline-block animate-scroll text-[#543313] font-semibold text-2xl md:text-3xl lg:text-4xl">
            Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp;
          </div>
          {/* 第二段文字（无缝循环） */}
          <div className="inline-block animate-scroll text-[#543313] font-semibold text-2xl md:text-3xl lg:text-4xl" aria-hidden="true">
            Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp; Spread the Love &nbsp;
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#add9a0]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-6 md:mb-8">Our Mission</h2>
          <p className="text-base md:text-lg text-[#543313] leading-relaxed px-2">
            By creating playful animal socks, animalsox spreads joy while giving back to those in need.
            That's why 10% of our profits are donated to charities.
          </p>
        </div>
      </section>

      {/* Comparison Section - 滑动对比图 */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#add9a0] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <ImageCompareSlider />
        </div>
      </section>

      {/* Wave Divider - Green to Beige */}
      <WaveDivider topColor="#add9a0" bottomColor="#e8e0ca" />

      {/* Reviews Section */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#e8e0ca]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-8 md:mb-12 text-center">
            Our animalsox Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-[#fffbf0] rounded-3xl p-6 border-2 border-[#543313]">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-purple-600">★</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-[#543313] mb-3">{review.title}</h3>
                <p className="text-[#543313] mb-4">{review.text} <span className="underline cursor-pointer" onClick={() => handleReadMore(idx)}>Read more</span></p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#543313]">{review.author}</p>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider - Beige to Green */}
      <WaveDivider topColor="#e8e0ca" bottomColor="#add9a0" />

      {/* Community Photos */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#add9a0]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-3 md:mb-4">#endlesshugs</h2>
          <p className="text-base md:text-lg text-[#543313] mb-6 md:mb-8 px-2">Join our little Community of over 10,000 happy Customers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              'https://ext.same-assets.com/2605587933/1829951904.jpeg',
              'https://ext.same-assets.com/2605587933/930353990.png',
              '/Sloth-Socks1.avif',
              '/Cat-Socks2.avif'
            ].map((img, idx) => (
              <div key={idx} className="aspect-square rounded-3xl overflow-hidden border-4 border-[#543313] rotate-3 hover:rotate-0 transition-transform">
                <Image src={img} alt={`Customer ${idx + 1}`} width={300} height={300} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider - Green to Beige */}
      <WaveDivider topColor="#add9a0" bottomColor="#e8e0ca" />

      {/* Newsletter Section */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-[#e8e0ca]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#543313] mb-4 md:mb-6">Join Our Family</h2>
          <p className="text-base md:text-lg text-[#543313] mb-6 md:mb-8 px-2">
            Sign up to get access to new products, adorable emails, discounts, and more
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-6 py-3 rounded-full border-2 border-[#543313] bg-[#f5c9e0] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#543313]"
            />
            <button className="bg-[#d41872] hover:bg-[#b01560] text-white px-8 py-3 rounded-full font-bold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full relative overflow-hidden">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 z-10 bg-black text-white rounded-full p-2 hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-48">
              <Image
                src="https://ext.same-assets.com/2605587933/2094874501.png"
                alt="Gift"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-[#543313] mb-4">
                Do You Want a<br />Free Suprise Gift!
              </h2>
              <button className="w-full bg-black text-white py-4 rounded-full font-bold mb-3 hover:bg-gray-800 transition-colors">
                Claim Free Gift
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-white text-[#543313] py-4 rounded-full font-bold border-2 border-[#543313] hover:bg-gray-50 transition-colors"
              >
                No, thanks, I hate free stuff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedReviewIndex !== null && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300"
            onClick={() => setShowReviewModal(false)}
          />
          {/* 弹窗内容 */}
          <div className="relative w-full md:w-1/2 h-full bg-[#fffbf0] shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="sticky top-0 bg-[#fffbf0] z-10 p-4 md:p-6 pb-4">
              <div className="flex items-center justify-between mb-4 gap-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#543313]">Our animalsox Community</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="bg-[#d41872] hover:bg-[#b01560] text-white rounded-full p-2 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* 分隔线 */}
              <div className="border-t-2 border-[#543313]"></div>
            </div>
            
            <div className="p-6 md:p-8">
              {selectedReviewIndex !== null && reviews[selectedReviewIndex] && (
                <>
                  {/* 星星和标题 */}
                  <div className="mb-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-purple-600 text-2xl md:text-3xl">★</span>
                      ))}
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#543313]">{reviews[selectedReviewIndex].title}</h3>
                  </div>
                  
                  {/* 分隔线 */}
                  <div className="border-t border-[#543313] mb-6"></div>
                  
                  {/* 评价文字 */}
                  <p className="text-xl md:text-2xl lg:text-3xl text-[#543313] mb-6 leading-relaxed">
                    {reviews[selectedReviewIndex].fullText}
                  </p>
                  
                  {/* 用户信息 */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                      {reviews[selectedReviewIndex].avatar ? (
                        <Image
                          src={reviews[selectedReviewIndex].avatar}
                          alt={reviews[selectedReviewIndex].author}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-[#543313]">{reviews[selectedReviewIndex].author}</p>
                      <p className="text-base md:text-lg text-gray-600">{reviews[selectedReviewIndex].location}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 回到顶部按钮 */}
      <ScrollToTopButton />

      {/* 购物车侧边栏 */}
      <CartSidebar />
    </div>
  );
}
