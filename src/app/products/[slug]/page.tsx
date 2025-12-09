'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { getProductBySlug, getRelatedProducts, getAllBundleProducts, products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

// 可选动物列表
const availableAnimals = [
  { slug: 'sloth-socks', name: 'Sloth', icon: '🦥' },
  { slug: 'cat-socks', name: 'Cat', icon: '🐱' },
  { slug: 'highland-cow-socks', name: 'Highland Cow', icon: '🐮' },
  { slug: 'red-panda-socks', name: 'Red Panda', icon: '🦊' },
  { slug: 'cavalier-dog-socks', name: 'Cavalier Dog', icon: '🐶' },
  { slug: 'crocodile-socks', name: 'Crocodile', icon: '🐊' },
  { slug: 'shark-socks', name: 'Shark', icon: '🦈' },
];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = getProductBySlug(resolvedParams.slug);
  const relatedProducts = getRelatedProducts(resolvedParams.slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAnimal, setSelectedAnimal] = useState(resolvedParams.slug);
  const [selectedOffer, setSelectedOffer] = useState('buy1-get1');
  const [selectedAnimalFor1Pair, setSelectedAnimalFor1Pair] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy1First, setSelectedAnimalForBuy1First] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy1Second, setSelectedAnimalForBuy1Second] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy2First, setSelectedAnimalForBuy2First] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy2Second, setSelectedAnimalForBuy2Second] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy2Third, setSelectedAnimalForBuy2Third] = useState(resolvedParams.slug);
  const [selectedAnimalForBuy2Fourth, setSelectedAnimalForBuy2Fourth] = useState(resolvedParams.slug);
  const { addToCart } = useCart();
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [productsCarouselIndex, setProductsCarouselIndex] = useState(0);
  const [reviewsCarouselIndex, setReviewsCarouselIndex] = useState(0);
  
  // Bundle specific state
  const [selectedBundleQuantity, setSelectedBundleQuantity] = useState<'1' | '2'>('1');
  const [selectedBundles, setSelectedBundles] = useState<Record<string, string>>({}); // Track selected bundle for each quantity
  const [showChooseDropdown, setShowChooseDropdown] = useState<Record<string, boolean>>({}); // Track if dropdown is shown for each quantity

  // 当选择动物时，跳转到对应产品的详情页
  const handleAnimalChange = (animalSlug: string) => {
    router.push(`/products/${animalSlug}`);
  };

  // 获取当前选择的动物产品（仅用于非bundle产品）
  const currentProduct = product?.isBundle ? product : (getProductBySlug(selectedAnimal) || product);

  // 计算购买数量（用于解锁免费赠品）
  const getTotalQuantity = () => {
    if (selectedOffer === '1-pair') return 1;
    if (selectedOffer === 'buy1-get1') return 2;
    if (selectedOffer === 'buy2-get2') return 4;
    return 0;
  };

  // 添加到购物车
  const handleAddToCart = () => {
    let cartItem;
    
    // Handle bundle products
    if (product?.isBundle && product.bundleOptions) {
      const bundleOption = product.bundleOptions[selectedBundleQuantity];
      const bundleQty = selectedBundleQuantity === '1' ? 1 : 2;
      
      cartItem = {
        id: `bundle-${resolvedParams.slug}-${selectedBundleQuantity}-${Date.now()}`,
        name: product.name,
        animal: product.name,
        image: product.images[0],
        price: bundleOption.price,
        originalPrice: bundleOption.price,
        quantity: bundleQty,
        offerType: 'bundle' as const,
        offerLabel: bundleOption.label,
        bundleQuantity: bundleQty,
      };
    } else {
      // Handle regular products
      const totalQty = getTotalQuantity();

      if (selectedOffer === '1-pair') {
        const prod = getProductBySlug(selectedAnimalFor1Pair);
        if (!prod) return;

        cartItem = {
          id: `${selectedOffer}-${selectedAnimalFor1Pair}-${Date.now()}`,
          name: 'Animal Socks <3',
          animal: prod.name,
          image: prod.images[0],
          price: 35,
          originalPrice: 35,
          quantity: 1,
          offerType: '1-pair' as const,
          offerLabel: '1 Pair',
          animals: [selectedAnimalFor1Pair],
        };
      } else if (selectedOffer === 'buy1-get1') {
        const prod1 = getProductBySlug(selectedAnimalForBuy1First);
        const prod2 = getProductBySlug(selectedAnimalForBuy1Second);
        if (!prod1 || !prod2) return;

        cartItem = {
          id: `${selectedOffer}-${selectedAnimalForBuy1First}-${selectedAnimalForBuy1Second}-${Date.now()}`,
          name: 'Animal Socks <3',
          animal: `${prod1.name} + ${prod2.name}`,
          image: prod1.images[0],
          price: 17.5,
          originalPrice: 35,
          quantity: 2,
          offerType: 'buy1-get1' as const,
          offerLabel: 'Buy 1, Get 1 Free',
          animals: [selectedAnimalForBuy1First, selectedAnimalForBuy1Second],
        };
      } else if (selectedOffer === 'buy2-get2') {
        const prod1 = getProductBySlug(selectedAnimalForBuy2First);
        if (!prod1) return;

        cartItem = {
          id: `${selectedOffer}-${Date.now()}`,
          name: 'Animal Socks <3',
          animal: `${prod1.name} + 3 more`,
          image: prod1.images[0],
          price: 15,
          originalPrice: 35,
          quantity: 4,
          offerType: 'buy2-get2' as const,
          offerLabel: 'Buy 2, Get 2 Free',
          animals: [selectedAnimalForBuy2First, selectedAnimalForBuy2Second, selectedAnimalForBuy2Third, selectedAnimalForBuy2Fourth],
        };
      }
    }

    if (cartItem) {
      addToCart(cartItem, false); // 不自动打开购物车
    }
  };

  if (!product || !currentProduct) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#e8e0ca] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#543313] mb-4">Product Not Found</h1>
            <Link href="/catalog" className="text-[#d41872] underline">
              Return to Catalog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // 产品轮播控制
  const productsPerView = 3; // 每次显示3个产品
  const maxProductsIndex = Math.max(0, relatedProducts.length - productsPerView);

  const handleProductsNext = () => {
    setProductsCarouselIndex(prev => Math.min(prev + 1, maxProductsIndex));
  };

  const handleProductsPrev = () => {
    setProductsCarouselIndex(prev => Math.max(prev - 1, 0));
  };

  // 评论数据
  const reviews = [
    {
      title: 'Cozy and Adorable!',
      text: "These socks are the comfiest I've ever owned, and the animal design makes me smile every time I put them on.",
      author: 'Jessi E.',
      location: 'Texas,CA'
    },
    {
      title: 'Perfect Gift',
      text: 'Got a pair for my sister and she absolutely loved them. Super soft and unique – now I want some for myself!',
      author: 'Daniel K.',
      location: 'London,UK'
    },
    {
      title: 'My New Chill Socks',
      text: 'I wear them every night when I read on the couch. They feel like a warm hug for my feet.',
      author: 'Sophie M.',
      location: 'Seattle'
    },
    {
      title: 'Best Quality!',
      text: 'The quality exceeded my expectations. These socks are thick, warm, and the animal design is so detailed!',
      author: 'Michael R.',
      location: 'New York'
    }
  ];

  // 评论轮播控制
  const reviewsPerView = 2; // 每次显示2个评论
  const maxReviewsIndex = Math.max(0, reviews.length - reviewsPerView);

  const handleReviewsNext = () => {
    setReviewsCarouselIndex(prev => Math.min(prev + 1, maxReviewsIndex));
  };

  const handleReviewsPrev = () => {
    setReviewsCarouselIndex(prev => Math.max(prev - 1, 0));
  };



  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Left - Images */}
            <div className="space-y-4 sticky top-24 self-start">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden border-4 border-[#543313]">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images - Show up to 4 images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#d41872] ring-2 ring-[#d41872]'
                        : 'border-[#543313] hover:border-[#d41872]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#543313] mb-6">
                  {product.isBundle ? product.name : 'Animal Socks <3'}
                </h1>

                {/* Animal Selector - Only show for non-bundle products */}
                {!product.isBundle && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#543313] font-semibold">Animal:</span>
                      <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
                        {availableAnimals.find(a => a.slug === selectedAnimal)?.name}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {availableAnimals.map((animal) => {
                        const isCurrentProduct = resolvedParams.slug === animal.slug;
                        return (
                          <Link
                            key={animal.slug}
                            href={`/products/${animal.slug}`}
                            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                              isCurrentProduct
                                ? 'border-[#543313] bg-[#add9a0] ring-2 ring-[#543313]'
                                : 'border-[#543313] bg-white hover:bg-[#add9a0]/30'
                            }`}
                            title={animal.name}
                          >
                            {animal.icon}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Limited Time Offer Badge - Only show for non-bundle products */}
              {!product.isBundle && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-[#add9a0] text-xl">💚</span>
                  <span className="text-[#543313] font-bold">Limited Time Offer</span>
                  <span className="text-[#add9a0] text-xl">💚</span>
                </div>
              )}

              {/* Bundle Selection - Show for bundle products */}
              {product.isBundle && product.bundleOptions ? (
                <div className="space-y-3">
                  {Object.entries(product.bundleOptions).map(([qty, option]) => {
                    // For 2 Bundles, show default product (first product) if not selected yet
                    const defaultSlug = qty === '2' ? (selectedBundles[qty] || products[0]?.slug || product.slug) : product.slug;
                    const selectedBundleSlug = selectedBundles[qty] || defaultSlug;
                    const selectedBundleProduct = getProductBySlug(selectedBundleSlug);
                    const showSelectionBar = selectedBundles[qty] !== undefined;
                    
                    return (
                      <div key={qty}>
                        <div
                          onClick={() => setSelectedBundleQuantity(qty as '1' | '2')}
                          className={`relative border-2 rounded-2xl cursor-pointer transition-all ${
                            selectedBundleQuantity === qty
                              ? 'border-[#543313] bg-[#add9a0] p-4'
                              : 'border-[#543313] bg-[#f5f5f5] hover:bg-[#add9a0]/30 p-3'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedBundleQuantity === qty
                                    ? 'border-[#543313] bg-[#543313]'
                                    : 'border-[#543313] bg-white'
                                }`}
                              >
                                {selectedBundleQuantity === qty && (
                                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[#543313] text-base">{option.label}</p>
                                {qty === '1' ? (
                                  <p className="text-xs text-[#543313]">Done for you Christmas Gifts</p>
                                ) : (
                                  <p className="text-xs text-[#543313]">{qty} Done for you Christmas Gifts</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#543313]">${option.price.toFixed(2)}</p>
                              {qty === '1' && (
                                <p className="text-xs text-gray-600 line-through">$39.50</p>
                              )}
                              {qty === '2' && (
                                <p className="text-xs text-gray-600 line-through">$74.50</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Show fixed product for 1 Bundle (no Choose button) */}
                          {selectedBundleQuantity === qty && qty === '1' && selectedBundleProduct && (
                            <div className="mt-3 pt-3 border-t border-[#543313] flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0">
                                <Image
                                  src={selectedBundleProduct.images[0]}
                                  alt={selectedBundleProduct.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-[#543313] text-lg">{selectedBundleProduct.name}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Show fixed product and Choose button for 2 Bundles */}
                          {selectedBundleQuantity === qty && qty === '2' && product && (
                            <div className="mt-3 pt-3 border-t border-[#543313] space-y-3">
                              {/* Fixed product display - always shows current page product */}
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-[#543313] text-lg">{product.name}</p>
                                </div>
                              </div>
                              
                              {/* Choose button and dropdown section */}
                              <div className="space-y-3">
                                {/* Default/Selected product display - always shown before and after choosing */}
                                {selectedBundleProduct && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0">
                                      <Image
                                        src={selectedBundleProduct.images[0]}
                                        alt={selectedBundleProduct.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-[#543313] text-lg">{selectedBundleProduct.name}</p>
                                    </div>
                                  </div>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowChooseDropdown(prev => ({ ...prev, [qty]: !prev[qty] }));
                                  }}
                                  className="bg-[#543313] hover:bg-[#3d2510] text-white px-4 py-1.5 rounded font-bold text-sm transition-colors"
                                >
                                  Choose
                                </button>
                                
                                {/* Dropdown that appears after clicking Choose */}
                                {showChooseDropdown[qty] && (
                                  <div>
                                    <label className="block text-sm font-semibold text-[#543313] mb-2">
                                      Select Product:
                                    </label>
                                    <select
                                      value={selectedBundleSlug}
                                      onChange={(e) => {
                                        const newSlug = e.target.value;
                                        setSelectedBundles(prev => ({ ...prev, [qty]: newSlug }));
                                        setShowChooseDropdown(prev => ({ ...prev, [qty]: false }));
                                      }}
                                      className="w-full border-2 border-[#543313] rounded-lg px-4 py-2 bg-white text-[#543313] font-semibold focus:outline-none focus:ring-2 focus:ring-[#543313]"
                                    >
                                      {products.map((prod) => (
                                        <option key={prod.slug} value={prod.slug}>
                                          {prod.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Offer Selection - Show for regular products
                <div className="space-y-3">
                {/* 1 Pair - Standard Price */}
                <div
                  onClick={() => setSelectedOffer('1-pair')}
                  className={`relative border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedOffer === '1-pair'
                      ? 'border-[#543313] bg-[#e8e0ca] p-4'
                      : 'border-[#543313] bg-[#f5f5f5] hover:bg-[#e8e0ca]/50 p-3'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOffer === '1-pair'
                            ? 'border-[#543313] bg-[#543313]'
                            : 'border-[#543313] bg-white'
                        }`}
                      >
                        {selectedOffer === '1-pair' && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#543313] text-base">1 Pair</p>
                        <p className="text-xs text-[#543313]">Standard Price</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#543313]">$35.00</p>
                    </div>
                  </div>

                  {/* Animal Selection - Only show when selected */}
                  {selectedOffer === '1-pair' && (
                    <div className="pt-2 border-t border-[#543313]">
                      <p className="text-sm font-semibold text-[#543313] mb-2">Animal</p>
                      <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                        <Image
                          src={getProductBySlug(selectedAnimalFor1Pair)?.images[0] || ''}
                          alt="Animal"
                          width={40}
                          height={40}
                          className="rounded"
                        />
                        <select
                          value={selectedAnimalFor1Pair}
                          onChange={(e) => setSelectedAnimalFor1Pair(e.target.value)}
                          className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                        >
                          {availableAnimals.map((animal) => (
                            <option key={animal.slug} value={animal.slug}>
                              {animal.name}
                            </option>
                          ))}
                        </select>
                        
                      </div>
                    </div>
                  )}
                </div>

                {/* Buy 1, Get 1 Free */}
                <div
                  onClick={() => setSelectedOffer('buy1-get1')}
                  className={`relative border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedOffer === 'buy1-get1'
                      ? 'border-[#543313] bg-[#add9a0] p-4'
                      : 'border-[#543313] bg-[#f5f5f5] hover:bg-[#add9a0]/30 p-3'
                  }`}
                >
                  <div className="absolute -top-2 right-3 bg-black text-white px-3 py-0.5 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOffer === 'buy1-get1'
                            ? 'border-[#543313] bg-[#543313]'
                            : 'border-[#543313] bg-white'
                        }`}
                      >
                        {selectedOffer === 'buy1-get1' && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#543313] text-base">Buy 1, Get 1 Free</p>
                        <p className="text-xs text-[#543313]">$17.5 per Pair</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#543313]">$35.00</p>
                      <p className="text-xs text-gray-600 line-through">$70.00</p>
                    </div>
                  </div>

                  {/* Animal Selection Dropdowns - Only show when selected */}
                  {selectedOffer === 'buy1-get1' && (
                    <div className="space-y-2 pt-2 border-t border-[#543313]">
                      <p className="text-sm font-semibold text-[#543313]">Animal</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy1First)?.images[0] || ''}
                            alt="Animal 1"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy1First}
                            onChange={(e) => setSelectedAnimalForBuy1First(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy1Second)?.images[0] || ''}
                            alt="Animal 2"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy1Second}
                            onChange={(e) => setSelectedAnimalForBuy1Second(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buy 2, Get 2 Free */}
                <div
                  onClick={() => setSelectedOffer('buy2-get2')}
                  className={`relative border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedOffer === 'buy2-get2'
                      ? 'border-[#543313] bg-[#add9a0] p-4'
                      : 'border-[#543313] bg-[#f5f5f5] hover:bg-[#add9a0]/30 p-3'
                  }`}
                >
                  <div className="absolute -top-2 right-3 bg-black text-white px-3 py-0.5 rounded-full text-xs font-bold">
                    Best Value
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOffer === 'buy2-get2'
                            ? 'border-[#543313] bg-[#543313]'
                            : 'border-[#543313] bg-white'
                        }`}
                      >
                        {selectedOffer === 'buy2-get2' && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#543313] text-base">Buy 2, Get 2 Free</p>
                        <p className="text-xs text-[#543313]">$15 per Pair + Free Shipping</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#543313]">$60.00</p>
                      <p className="text-xs text-gray-600 line-through">$140.00</p>
                    </div>
                  </div>

                  {/* Animal Selection - Only show when selected */}
                  {selectedOffer === 'buy2-get2' && (
                    <div className="space-y-2 pt-2 border-t border-[#543313]">
                      <p className="text-sm font-semibold text-[#543313]">Animal</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy2First)?.images[0] || ''}
                            alt="Animal 1"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy2First}
                            onChange={(e) => setSelectedAnimalForBuy2First(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy2Second)?.images[0] || ''}
                            alt="Animal 2"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy2Second}
                            onChange={(e) => setSelectedAnimalForBuy2Second(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy2Third)?.images[0] || ''}
                            alt="Animal 3"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy2Third}
                            onChange={(e) => setSelectedAnimalForBuy2Third(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-[#543313] rounded-lg p-1.5">
                          <Image
                            src={getProductBySlug(selectedAnimalForBuy2Fourth)?.images[0] || ''}
                            alt="Animal 4"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <select
                            value={selectedAnimalForBuy2Fourth}
                            onChange={(e) => setSelectedAnimalForBuy2Fourth(e.target.value)}
                            className="flex-1 bg-transparent text-[#543313] text-sm font-semibold focus:outline-none cursor-pointer"
                          >
                            {availableAnimals.map((animal) => (
                              <option key={animal.slug} value={animal.slug}>
                                {animal.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              )}

              {/* Your Freebies - Only show for non-bundle products */}
              {!product.isBundle && (
                <div>
                  <p className="font-bold text-[#543313] mb-1 text-xl text-center">Your Freebies:</p>
                  <p className="text-base text-[#543313] mb-3 text-center">Its on us, we love you &lt;3</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Cute Stickers - Always unlocked */}
                    <div className="border-2 border-[#543313] rounded-2xl p-3 bg-[#add9a0] text-center relative">
                      <p className="absolute top-2 left-2 text-xs font-bold text-[#543313]">FREE $5.00</p>
                      <div className="text-4xl mb-2">🎨</div>
                      <div className="bg-white rounded px-2 py-1 mb-1">
                        <p className="text-xs font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                      </div>
                      <p className="text-sm font-bold text-[#543313]">Cute Stickers</p>
                    </div>

                    {/* Cheetah Express Shipping - Unlocks at 3+ pairs */}
                    <div className={`border-2 border-[#543313] rounded-2xl p-3 text-center transition-all relative ${
                      getTotalQuantity() >= 3
                        ? 'bg-[#add9a0]'
                        : 'bg-gray-200 opacity-60'
                    }`}>
                      {getTotalQuantity() >= 3 && (
                        <p className="absolute top-2 left-2 text-xs font-bold text-[#543313]">FREE $8</p>
                      )}
                      <div className="text-4xl mb-2">{getTotalQuantity() >= 3 ? '🚚' : '🔒'}</div>
                      <p className="text-sm font-bold text-[#543313]">
                        {getTotalQuantity() >= 3 ? 'Cheetah Express Shipping' : 'Locked'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {product.isBundle ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#add9a0] hover:bg-[#9ac98c] border-2 border-[#543313] text-[#543313] py-4 rounded-full font-bold text-xl transition-colors shadow-lg hover:shadow-xl"
                  >
                    Add to cart
                  </button>
                  <button
                    className="flex-1 bg-[#a89bb8] hover:bg-[#9688a8] border-2 border-[#543313] text-white py-4 rounded-full font-bold text-xl transition-colors shadow-lg hover:shadow-xl"
                  >
                    Buy with Shop
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#add9a0] hover:bg-[#9ac98c] border-2 border-[#543313] text-[#543313] py-4 rounded-full font-bold text-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Add to cart
                </button>
              )}

              {/* Gift Packaging */}
              <div className="rounded-2xl p-4 bg-[#e8e0ca]">
                <p className="font-bold text-[#543313] mb-3">{product.isBundle ? 'Sending as a Gift?' : 'Buying as a Gift?'}</p>
                <div className="flex items-center justify-between bg-white border-2 border-[#543313] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://ext.same-assets.com/2605587933/2012530478.png"
                      alt="Gift Box"
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div>
                      <p className="font-bold text-[#543313]">{product.isBundle ? 'Exclusive Gift Packaging' : 'Christmas Gift Packaging'}</p>
                      <p className="text-sm text-[#543313]">{product.isBundle ? '$5.00' : '$3.95'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!giftPackaging) {
                        const giftItem = {
                          id: `gift-packaging-${Date.now()}`,
                          name: product.isBundle ? 'Exclusive Gift Packaging' : 'Christmas Gift Packaging',
                          animal: 'Gift Packaging',
                          image: 'https://ext.same-assets.com/2605587933/2012530478.png',
                          price: product.isBundle ? 5.00 : 3.95,
                          originalPrice: product.isBundle ? 5.00 : 3.95,
                          quantity: 1,
                          offerType: '1-pair' as const,
                          offerLabel: 'Gift Packaging',
                        };
                        addToCart(giftItem, false); // 不自动打开购物车
                        setGiftPackaging(true);
                      }
                    }}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full font-bold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-3">
              </div>
            </div>
          </div>

          {/* Active Offer Banner */}
          <div className="mb-16">
            <Image
              src="https://ext.same-assets.com/2605587933/3082358463.png"
              alt="Buy 1, Get 1 Free"
              width={1200}
              height={400}
              className="w-full rounded-3xl"
            />
          </div>

          {/* 20,000 Smiles Delivered */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#543313] text-center mb-8">
              20,000 Smiles Delivered!
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Image
                src="https://ext.same-assets.com/2605587933/131181731.jpeg"
                alt="Customer 1"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
              <Image
                src="https://ext.same-assets.com/2605587933/2081407957.jpeg"
                alt="Customer 2"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
              <Image
                src="https://ext.same-assets.com/2605587933/4089070469.jpeg"
                alt="Customer 3"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
              <Image
                src="https://ext.same-assets.com/2605587933/1629102377.jpeg"
                alt="Customer 4"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
              <Image
                src="https://ext.same-assets.com/2605587933/3609518866.jpeg"
                alt="Customer 5"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
              <Image
                src="https://ext.same-assets.com/2605587933/149980745.jpeg"
                alt="Customer 6"
                width={400}
                height={400}
                className="rounded-3xl border-4 border-[#543313] w-full aspect-square object-cover"
              />
            </div>
          </section>

          {/* Done For You Christmas Gifts */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#543313] text-center mb-8">
              "Done For You" Christmas Gifts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Link href="/products/cats-and-dogs-bundle" className="block">
                <div className="border-4 border-[#543313] rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src="https://ext.same-assets.com/2605587933/3709302975.jpeg"
                      alt="Cats and Dogs Bundle"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#543313] mb-2">Cats and Dogs Bundle</h3>
                    <p className="text-lg text-[#543313]">$39.50</p>
                  </div>
                </div>
              </Link>
              <Link href="/products/sharks-and-crocs-bundle" className="block">
                <div className="border-4 border-[#543313] rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src="https://ext.same-assets.com/2605587933/384229386.jpeg"
                      alt="Sharks and Crocs Bundle"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#543313] mb-2">Sharks and Crocs Bundle</h3>
                    <p className="text-lg text-[#543313]">$35.00</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>



          {/* Why Perfect Gift */}
          <section className="mb-16 relative">
            <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
              <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,50 Q150,0 300,50 T600,50 T900,50 T1200,50" fill="none" stroke="#543313" strokeWidth="2" />
              </svg>
            </div>
            <div className="pt-24">
              <h2 className="text-3xl md:text-4xl font-bold text-[#543313] text-center mb-12">
                Why are our Animal Socks the perfect gift?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-bold text-[#543313] mb-2">99% Customer Satisfaction</h3>
                  <p className="text-[#543313]">Less than 1% complaints</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-[#543313] mb-2">4.9-Star Reviews</h3>
                  <p className="text-[#543313]">Trusted by thousands of customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-[#543313] mb-2">50,000+ Gifts Delivered</h3>
                  <p className="text-[#543313]">Surprises that always delight</p>
                </div>
              </div>
            </div>
          </section>

          {/* Other Products and Customer Reviews - Side by Side */}
          <div className="mb-16">
            {/* Titles */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#543313]">
                  Our other Hugging Frens
                </h2>
                {relatedProducts.length > productsPerView && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleProductsPrev}
                      disabled={productsCarouselIndex === 0}
                      className={`w-10 h-10 rounded-full border-2 border-[#543313] flex items-center justify-center transition-all ${
                        productsCarouselIndex === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-[#543313] hover:bg-[#add9a0]'
                      }`}
                      aria-label="Previous products"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleProductsNext}
                      disabled={productsCarouselIndex === maxProductsIndex}
                      className={`w-10 h-10 rounded-full border-2 border-[#543313] flex items-center justify-center transition-all ${
                        productsCarouselIndex === maxProductsIndex
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-[#543313] hover:bg-[#add9a0]'
                      }`}
                      aria-label="Next products"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
            </div>

            {/* Other Products */}
            <div className="mb-16">
              <div className="relative overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" style={{
                  transform: `translateX(-${productsCarouselIndex * (100 / productsPerView)}%)`
                }}>
                  {relatedProducts.map((item) => (
                    <div key={item.id} className="min-w-0 flex-shrink-0" style={{ width: `${100 / productsPerView}%` }}>
                      <Link href={`/products/${item.slug}`} className="block px-3">
                        <div className="border-4 border-[#543313] rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
                          <div className="aspect-square relative">
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 text-center bg-white">
                            <h3 className="text-lg font-bold text-[#543313] mb-1">{item.name}</h3>
                            <p className="text-[#543313]">{item.price}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* #endlesshugs */}
          <section className="bg-[#add9a0] rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#543313] text-center mb-4">
              #endlesshugs
            </h2>
            <p className="text-center text-[#543313] mb-8">
              Join our little Community of over 10,000 happy Customers
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                'https://ext.same-assets.com/2605587933/293267036.jpeg',
                'https://ext.same-assets.com/2605587933/1792241210.jpeg',
                'https://ext.same-assets.com/2605587933/1525787751.jpeg',
                'https://ext.same-assets.com/2605587933/2969129602.jpeg',
                'https://ext.same-assets.com/2605587933/4054764550.jpeg'
              ].map((img, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-4 border-[#543313]">
                  <Image
                    src={img}
                    alt={`Customer ${idx + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

            {/* Customer Reviews */}
            <div>
              {/* Title and Navigation Buttons - Same Line */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#543313]">
                  Customer Reviews
                </h2>
                {reviews.length > reviewsPerView && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleReviewsPrev}
                      disabled={reviewsCarouselIndex === 0}
                      className={`w-10 h-10 rounded-full border-2 border-[#543313] flex items-center justify-center transition-all ${
                        reviewsCarouselIndex === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-[#543313] hover:bg-[#add9a0]'
                      }`}
                      aria-label="Previous reviews"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleReviewsNext}
                      disabled={reviewsCarouselIndex === maxReviewsIndex}
                      className={`w-10 h-10 rounded-full border-2 border-[#543313] flex items-center justify-center transition-all ${
                        reviewsCarouselIndex === maxReviewsIndex
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-[#543313] hover:bg-[#add9a0]'
                      }`}
                      aria-label="Next reviews"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="relative overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" style={{
                  transform: `translateX(-${reviewsCarouselIndex * (100 / reviewsPerView)}%)`
                }}>
                  {reviews.map((review, idx) => (
                    <div key={idx} className="min-w-0 flex-shrink-0" style={{ width: `${100 / reviewsPerView}%` }}>
                      <div className="bg-white border-4 border-[#543313] rounded-3xl p-6 mx-3">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-purple-600">★</span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-[#543313] mb-3">{review.title}</h3>
                        <p className="text-[#543313] mb-4">{review.text}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="font-bold text-[#543313]">{review.author}</p>
                            <p className="text-sm text-gray-600">{review.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
