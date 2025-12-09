'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { X } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal, addFreeStickers, removeFreeStickers, hasFreeStickers, hasOtherItems } = useCart();
  const [orderNotes, setOrderNotes] = useState('');

  return (
    <Layout>
      <div className="min-h-screen bg-[#e8e0ca] py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#543313] mb-8">Shopping Cart</h1>
          
          {/* Separator Line */}
          <div className="h-[2px] bg-[#543313] mb-8"></div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-3xl md:text-4xl font-bold text-[#543313] mb-8">Your cart is empty</p>
              <Link
                href="/catalog"
                className="inline-block bg-[#d41872] hover:bg-[#b01560] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2">
                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-2 border-b-2 border-[#543313]">
                  <div className="col-span-6">
                    <span className="text-lg font-bold text-[#543313]">Product</span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="text-lg font-bold text-[#543313]">Quantity</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-lg font-bold text-[#543313]">Total</span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-6">
                  {items.filter(item => !item.isFreeStickers).map((item) => (
                    <div key={item.id} className="relative bg-white border-2 border-[#543313] rounded-lg p-4 md:p-6">
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#d41872] hover:bg-[#b01560] flex items-center justify-center transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="md:col-span-6 flex gap-4">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                              {item.name}
                            </h3>
                            <p className="text-[#543313] mb-2">{item.animal}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 line-through text-sm">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-[#543313]">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            {item.offerLabel && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[#543313]">🏷️</span>
                                <span className="text-sm font-semibold text-[#543313]">
                                  {item.offerLabel}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-3 flex justify-center md:justify-start">
                          <div className="flex items-center gap-3 border-2 border-[#543313] rounded-full px-4 py-2 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[#543313] font-bold text-xl hover:text-[#d41872] transition-colors"
                            >
                              −
                            </button>
                            <span className="text-[#543313] font-bold min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-[#543313] font-bold text-xl hover:text-[#d41872] transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="md:col-span-3 text-right">
                          <p className="text-sm text-gray-500 line-through mb-1">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xl font-bold text-[#543313]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Free Stickers Item */}
                  {hasFreeStickers() && (
                    items.filter(item => item.isFreeStickers).map((stickerItem) => {
                      // First sticker is free, subsequent stickers cost $5 each
                      // Display price: $0.00 if quantity is 1, $5.00 if quantity > 1
                      const displayPrice = stickerItem.quantity === 1 ? 0 : stickerItem.price;
                      return (
                        <div key={stickerItem.id} className="bg-white border border-[#543313] rounded-lg p-4 md:p-6">
                          <div className="flex gap-4 items-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl mb-1">🎨</div>
                                <p className="text-xs font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                                Cute Stickers
                              </h3>
                              <p className="text-sm text-[#543313] mb-2">1 PAIR (-$5.00)</p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-gray-500 line-through text-sm">$5.00</span>
                                <span className="text-lg font-bold text-[#543313]">
                                  {displayPrice === 0 ? '$0.00' : `$${displayPrice.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[#543313]">🏷️</span>
                                <span className="text-sm font-semibold text-[#543313]">Free Gift</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 border-2 border-[#543313] rounded-full px-4 py-2 bg-white">
                                  <button
                                    onClick={() => updateQuantity(stickerItem.id, stickerItem.quantity - 1)}
                                    className="text-[#543313] font-bold text-xl hover:text-[#d41872] transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="text-[#543313] font-bold min-w-[30px] text-center">
                                    {stickerItem.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(stickerItem.id, stickerItem.quantity + 1)}
                                    className="text-[#543313] font-bold text-xl hover:text-[#d41872] transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFreeStickers()}
                                  className="text-[#543313] underline hover:text-[#d41872] transition-colors font-semibold"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add Free Stickers */}
                  {!hasFreeStickers() && (
                    <div className="bg-white border border-[#543313] rounded-lg p-4 md:p-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-1">🎨</div>
                            <p className="text-xs font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                            Cute Stickers
                          </h3>
                          <p className="text-sm text-[#543313] mb-2">1 PAIR (-$5.00)</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-gray-500 line-through text-sm">$5.00</span>
                            <span className="text-lg font-bold text-[#543313]">$0.00</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#543313]">🏷️</span>
                            <span className="text-sm font-semibold text-[#543313]">Free Gift</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border-2 border-[#543313] rounded-full px-4 py-2 bg-white">
                              <button
                                onClick={addFreeStickers}
                                className="text-[#543313] font-bold text-xl hover:text-[#d41872] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={addFreeStickers}
                              className="text-[#543313] underline hover:text-[#d41872] transition-colors font-semibold"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-8">
                  <Link
                    href="/catalog"
                    className="inline-block bg-[#d41872] hover:bg-[#b01560] text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-[#543313] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-[#543313] rounded-lg p-6 sticky top-24">
                  {/* Order Notes */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#543313] mb-3">Order notes</h2>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Order special instructions"
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872] resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Shipping */}
                  <div className="mb-6 pb-6 border-b-2 border-[#543313]">
                    <h2 className="text-xl font-bold text-[#543313] mb-2">Shipping</h2>
                    <p className="text-sm text-[#543313]">
                      Taxes included. Discounts and{' '}
                      <Link 
                        href="/policies/shipping-policy" 
                        className="underline cursor-pointer hover:text-[#d41872] transition-colors"
                      >
                        shipping
                      </Link>{' '}
                      calculated at checkout.
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-[#543313]">Subtotal</span>
                      <span className="text-lg font-bold text-[#543313]">
                        ${getSubtotal().toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-[#c9b8d4] hover:bg-[#b9a8c4] border-2 border-[#543313] text-[#543313] py-3 rounded-lg font-bold transition-colors">
                      shop
                    </button>
                    <button className="w-full bg-[#ffc439] hover:bg-[#ffb800] border-2 border-[#543313] text-[#0070ba] py-3 rounded-lg font-bold transition-colors">
                      PayPal
                    </button>
                    <button className="w-full bg-black hover:bg-gray-800 border-2 border-[#543313] text-white py-3 rounded-lg font-bold transition-colors">
                      G Pay
                    </button>
                    <Link
                      href="/checkouts"
                      className="w-full bg-[#d41872] hover:bg-[#b01560] border-2 border-[#543313] text-white py-4 rounded-lg font-bold text-lg transition-colors text-center block"
                    >
                      Check out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

