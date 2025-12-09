'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  animal: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  offerType: '1-pair' | 'buy1-get1' | 'buy2-get2' | 'bundle' | 'free-stickers';
  offerLabel: string;
  animals?: string[]; // For bundle offers
  bundleQuantity?: number; // For bundle products (1 or 2)
  isFreeStickers?: boolean; // Mark free stickers item
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem, shouldOpenCart?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  addFreeStickers: () => void;
  removeFreeStickers: () => void;
  hasFreeStickers: () => boolean;
  hasOtherItems: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem, shouldOpenCart: boolean = true) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
    if (shouldOpenCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    const hasOtherItems = items.some(item => !item.isFreeStickers);
    return items.reduce((total, item) => {
      if (item.isFreeStickers) {
        // If only free stickers in cart, charge for them
        // If has other items, first sticker is free, additional stickers cost $5 each
        if (hasOtherItems) {
          // First sticker is free, remaining stickers cost $5 each
          const chargeableQuantity = Math.max(0, item.quantity - 1);
          return total + item.price * chargeableQuantity;
        } else {
          // Only free stickers: first one is free, additional ones cost $5 each
          const chargeableQuantity = Math.max(0, item.quantity - 1);
          return total + item.price * chargeableQuantity;
        }
      }
      return total + item.price * item.quantity;
    }, 0);
  };

  const addFreeStickers = () => {
    const freeStickersItem: CartItem = {
      id: 'free-stickers',
      name: 'Cute Stickers',
      animal: '1 PAIR (-$5.00)',
      image: '',
      price: 5.00, // Original price, will be free if other items exist
      originalPrice: 5.00,
      quantity: 1,
      offerType: 'free-stickers',
      offerLabel: 'Free Gift',
      isFreeStickers: true,
    };
    addToCart(freeStickersItem, false);
  };

  const removeFreeStickers = () => {
    removeFromCart('free-stickers');
  };

  const hasFreeStickers = () => {
    return items.some(item => item.isFreeStickers);
  };

  const hasOtherItems = () => {
    return items.some(item => !item.isFreeStickers);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        openCart,
        closeCart,
        getTotalItems,
        getSubtotal,
        addFreeStickers,
        removeFreeStickers,
        hasFreeStickers,
        hasOtherItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
