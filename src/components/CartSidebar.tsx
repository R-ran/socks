'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function CartSidebar() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, getSubtotal, addFreeStickers, removeFreeStickers, hasFreeStickers, hasOtherItems } = useCart();
  const [showOrderNotes, setShowOrderNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-[#fffbf0] z-50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="bg-[#e8e0ca] border-b-4 border-[#543313] p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-[#543313]">Your Cart</h2>
            <button
              onClick={closeCart}
              className="w-12 h-12 rounded-full bg-[#d41872] hover:bg-[#b01560] border-2 border-black flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6 text-white stroke-2" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-3xl md:text-4xl font-bold text-[#543313]">No Items Added Yet</p>
            </div>
          ) : (
            <>
              {items.filter(item => !item.isFreeStickers).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-4 border-[#543313] rounded-2xl p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-[#543313] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#543313] mb-2">{item.animal}</p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-500 line-through text-sm">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-[#543313]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Offer Label */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#543313]">🏷️</span>
                        <span className="text-sm font-semibold text-[#543313]">
                          {item.offerLabel}
                        </span>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center justify-between">
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

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#543313] underline hover:text-[#d41872] transition-colors font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
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

              {/* Free Items - Stickers */}
              {hasFreeStickers() && (
                items.filter(item => item.isFreeStickers).map((stickerItem) => {
                  // First sticker is free, subsequent stickers cost $5 each
                  // Display price: $0.00 if quantity is 1, $5.00 if quantity > 1
                  const displayPrice = stickerItem.quantity === 1 ? 0 : stickerItem.price;
                  return (
                    <div key={stickerItem.id} className="bg-white border-4 border-[#543313] rounded-2xl p-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-1">🎨</div>
                            <p className="text-xs font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                            Cute Stickers
                          </h3>
                          <p className="text-[#543313] mb-2">1 PAIR (-$5.00)</p>

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

                          {/* Quantity Control */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 border-2 border-[#543313] rounded-full px-4 py-2 bg-white">
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
                <div className="bg-white border-4 border-[#543313] rounded-2xl p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-[#543313] flex-shrink-0 bg-[#add9a0] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-1">🎨</div>
                        <p className="text-xs font-bold text-[#543313]">ANIMAL<br/>SOCKS</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-[#543313] mb-1">
                        Cute Stickers
                      </h3>
                      <p className="text-[#543313] mb-2">1 PAIR (-$5.00)</p>
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

              {/* Order Notes */}
              <div className="border-t-2 border-[#543313] pt-4">
                <button 
                  onClick={() => setShowOrderNotes(!showOrderNotes)}
                  className="flex items-center gap-2 text-[#543313] font-semibold hover:text-[#d41872] transition-colors underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Order notes
                </button>
                {showOrderNotes && (
                  <div className="mt-4">
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Order special instructions"
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#543313] bg-white text-[#543313] placeholder-[#543313]/50 focus:outline-none focus:ring-2 focus:ring-[#d41872] resize-none"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              {/* Subtotal */}
              <div>
                <div className="text-center mb-4">
                  <p className="text-3xl md:text-4xl font-bold text-[#543313] mb-2">
                    Subtotal: ${getSubtotal().toFixed(2)} USD
                  </p>
                  <p className="text-lg text-[#543313]">
                    Taxes included. Discounts and{' '}
                    <Link 
                      href="/policies/shipping-policy" 
                      onClick={closeCart}
                      className="underline cursor-pointer text-lg hover:text-[#d41872] transition-colors"
                    >
                      shipping
                    </Link>{' '}
                    calculated at checkout.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="bg-[#c9b8d4] hover:bg-[#b9a8c4] border-2 border-[#543313] text-[#543313] py-4 rounded-full font-bold text-lg transition-colors text-center"
                  >
                    View cart
                  </Link>
                  <Link
                    href="/checkouts"
                    onClick={closeCart}
                    className="bg-[#d41872] hover:bg-[#b01560] border-2 border-[#543313] text-white py-4 rounded-full font-bold text-lg transition-colors text-center"
                  >
                    Check out
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
