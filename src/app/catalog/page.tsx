'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Layout from '@/components/Layout';
import { products } from '@/data/products';

export default function CatalogPage() {
  const [showInStock, setShowInStock] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('35.00');
  const [sortBy, setSortBy] = useState('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  // 先应用价格过滤（用于计算库存数量）
  const priceFilteredProducts = products.filter(product => {
    const price = parseFloat(product.price.replace('$', ''));
    const fromPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const toPrice = priceTo ? parseFloat(priceTo) : 999;
    return price >= fromPrice && price <= toPrice;
  });

  // 计算基于价格过滤后的库存数量
  const inStockCount = priceFilteredProducts.filter(p => p.inStock).length;
  const outOfStockCount = priceFilteredProducts.filter(p => !p.inStock).length;

  // 过滤产品（应用所有过滤条件）
  const filteredProducts = priceFilteredProducts.filter(product => {
    if (showInStock && !product.inStock) return false;
    if (showOutOfStock && product.inStock) return false;
    return true;
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
                {/* Availability 过滤 */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#543313] mb-4">Availability</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInStock}
                        onChange={(e) => setShowInStock(e.target.checked)}
                        className="w-6 h-6 rounded border-2 border-[#543313] text-[#d41872] focus:ring-[#d41872]"
                      />
                      <span className="text-[#543313] text-lg">In stock [{inStockCount}]</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOutOfStock}
                        onChange={(e) => setShowOutOfStock(e.target.checked)}
                        className="w-6 h-6 rounded border-2 border-[#543313] text-[#d41872] focus:ring-[#d41872]"
                      />
                      <span className="text-[#543313] text-lg">Out of stock [{outOfStockCount}]</span>
                    </label>
                  </div>
                </div>

                <div className="border-t-2 border-[#543313] my-6"></div>

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
              {/* 顶部排序和产品数量 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-[#543313] font-semibold text-lg">{sortedProducts.length} Products</p>
                <div className="w-full sm:w-auto relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full sm:w-64 px-4 py-3 rounded-lg border-2 border-[#543313] bg-[#add9a0] text-[#543313] font-bold focus:outline-none focus:ring-2 focus:ring-[#543313] cursor-pointer flex items-center justify-between"
                  >
                    <span>
                      {sortBy === 'featured' && 'Featured'}
                      {sortBy === 'best-selling' && 'Best selling'}
                      {sortBy === 'alphabetically-a-z' && 'Alphabetically, A-Z'}
                      {sortBy === 'alphabetically-z-a' && 'Alphabetically, Z-A'}
                      {sortBy === 'price-low-high' && 'Price, low to high'}
                      {sortBy === 'price-high-low' && 'Price, high to low'}
                      {sortBy === 'date-old-new' && 'Date, old to new'}
                      {sortBy === 'date-new-old' && 'Date, new to old'}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#543313] rounded-lg overflow-hidden z-10 shadow-lg">
                      {[
                        { value: 'featured', label: 'Featured' },
                        { value: 'best-selling', label: 'Best selling' },
                        { value: 'alphabetically-a-z', label: 'Alphabetically, A-Z' },
                        { value: 'alphabetically-z-a', label: 'Alphabetically, Z-A' },
                        { value: 'price-low-high', label: 'Price, low to high' },
                        { value: 'price-high-low', label: 'Price, high to low' },
                        { value: 'date-old-new', label: 'Date, old to new' },
                        { value: 'date-new-old', label: 'Date, new to old' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left border-b-2 border-[#543313] last:border-b-0 font-bold text-[#543313] transition-colors ${
                            sortBy === option.value
                              ? 'bg-[#e8e0ca]'
                              : 'bg-[#add9a0] hover:bg-[#9ac98c]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                        {!product.inStock && !product.comingSoon && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="bg-[#543313] text-white px-6 py-3 rounded-full font-bold">
                              Out of Stock
                            </span>
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
