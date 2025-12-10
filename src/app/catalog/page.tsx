'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { products } from '@/data/products';

export default function CatalogPage() {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('35.00');
  const [sortBy] = useState('featured');

  // 只显示 id 1-9 的产品，并应用价格过滤
  const filteredProducts = products.filter(product => {
    // 只保留 id 1 到 9 的产品
    if (product.id < 1 || product.id > 9) {
      return false;
    }
    // 应用价格过滤
    const price = parseFloat(product.price.replace('$', ''));
    const fromPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const toPrice = priceTo ? parseFloat(priceTo) : 999;
    return price >= fromPrice && price <= toPrice;
  });

  // 排序产品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      case 'price-high-low':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      case 'alphabetically-a-z':
        return a.name.localeCompare(b.name);
      case 'alphabetically-z-a':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧过滤器 */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-[#543313] rounded-lg p-6 sticky top-24">
                {/* Price 过滤 */}
                <div>
                  <h3 className="text-2xl font-bold text-[#543313] mb-4">Price</h3>
                  <p className="text-base text-[#543313] mb-4">The highest price is $35.00</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-base text-[#543313] mb-1 block">From</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#543313] text-lg">$</span>
                        <input
                          type="number"
                          value={priceFrom}
                          onChange={(e) => setPriceFrom(e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-3 rounded-lg border-2 border-[#543313] bg-[#c9b8d4] text-[#543313] text-base placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-base text-[#543313] mb-1 block">To</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#543313] text-lg">$</span>
                        <input
                          type="number"
                          value={priceTo}
                          onChange={(e) => setPriceTo(e.target.value)}
                          placeholder="35.00"
                          className="w-full pl-7 pr-3 py-3 rounded-lg border-2 border-[#543313] bg-[#c9b8d4] text-[#543313] text-base placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872]"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#d41872] hover:bg-[#b01560] text-white py-3 rounded-lg font-bold text-lg transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧产品网格 */}
            <div className="lg:col-span-2">
              {/* 产品数量 */}
              <div className="mb-8">
                <p className="text-[#543313] font-semibold text-lg">{sortedProducts.length} Products</p>
              </div>

              {/* 产品网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="block"
                  >
                    <div className="group bg-white border-2 border-[#543313] rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.comingSoon && (
                          <div className="absolute top-4 left-4 bg-[#543313] text-white px-4 py-2 rounded-full font-bold text-sm">
                            Coming soon
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold text-[#543313] mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-lg text-[#543313] font-semibold">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-2xl text-[#543313] font-bold">No products found</p>
                  <p className="text-[#543313] mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
