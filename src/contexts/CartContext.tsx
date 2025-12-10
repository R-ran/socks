'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';

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
  userRemovedStickers: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const userRemovedStickersRef = useRef(false);

  // 计算非免费贴纸商品的总数量
  const getOtherItemsTotal = (itemsList: CartItem[]) => {
    return itemsList
      .filter(item => !item.isFreeStickers)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // 同步免费贴纸的状态：如果非免费商品数量 >= 1，自动添加免费贴纸；如果 < 1，保留但价格变回5
  // 如果用户手动删除了贴纸（skipAutoAdd = true），需要商品数量 >= 2 才自动添加
  const syncFreeStickers = (itemsList: CartItem[], skipAutoAdd: boolean = false) => {
    const otherItemsTotal = getOtherItemsTotal(itemsList);
    const hasStickers = itemsList.some(item => item.isFreeStickers);

    // 如果购物车中没有非免费商品，重置标记（恢复正常逻辑）
    if (otherItemsTotal === 0) {
      userRemovedStickersRef.current = false;
      return itemsList;
    }

    // 确定是否需要添加免费贴纸的阈值
    const threshold = skipAutoAdd ? 2 : 1;

    if (otherItemsTotal >= threshold) {
      // 需要添加免费贴纸（仅当还没有时才添加）
      if (!hasStickers) {
        const freeStickersItem: CartItem = {
          id: 'free-stickers',
          name: 'Cute Stickers',
          animal: '1 PAIR (-$5.00)',
          image: '',
          price: 5.00,
          originalPrice: 5.00,
          quantity: 1,
          offerType: 'free-stickers',
          offerLabel: 'Free Gift',
          isFreeStickers: true,
        };
        // 如果自动添加了贴纸，重置用户删除标记
        if (skipAutoAdd) {
          userRemovedStickersRef.current = false;
        }
        return [...itemsList, freeStickersItem];
      }
    }
    // 如果 < threshold，不自动移除免费贴纸，让它保留但价格会按原价计算

    return itemsList;
  };

  const addToCart = (item: CartItem, shouldOpenCart: boolean = true) => {
    setItems((prevItems) => {
      // 检查添加商品之前购物车中非免费商品的数量
      const prevOtherItemsTotal = getOtherItemsTotal(prevItems);
      
      // 如果之前购物车为空（没有非免费商品），重置用户删除贴纸的标记
      // 这样重新开始添加商品时，会恢复正常逻辑
      if (prevOtherItemsTotal === 0) {
        userRemovedStickersRef.current = false;
      }
      
      // 先更新商品
      const existingItem = prevItems.find((i) => i.id === item.id);
      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updatedItems = [...prevItems, item];
      }
      // 然后同步免费贴纸（如果用户手动移除了免费贴纸，不自动添加）
      return syncFreeStickers(updatedItems, userRemovedStickersRef.current);
    });
    if (shouldOpenCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => {
      // 如果移除的是免费贴纸本身，直接移除并标记为用户手动移除
      if (id === 'free-stickers') {
        userRemovedStickersRef.current = true;
        const updatedItems = prevItems.filter((item) => item.id !== id);
        // 检查移除贴纸后，如果购物车为空，重置标记
        const otherItemsTotal = getOtherItemsTotal(updatedItems);
        if (otherItemsTotal === 0) {
          userRemovedStickersRef.current = false;
        }
        return updatedItems;
      }
      // 否则移除商品后，不删除免费贴纸，保留它（价格会根据是否有其他商品自动调整）
      // 不再调用 syncFreeStickers，让免费贴纸保留
      const updatedItems = prevItems.filter((item) => item.id !== id);
      // 检查移除商品后，如果购物车为空，重置标记
      const otherItemsTotal = getOtherItemsTotal(updatedItems);
      if (otherItemsTotal === 0) {
        userRemovedStickersRef.current = false;
      }
      return updatedItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) => {
      // 先更新数量
      let updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      // 如果更新的是免费贴纸数量，保持免费贴纸（不会自动移除）
      const item = prevItems.find(i => i.id === id);
      if (!item?.isFreeStickers) {
        // 如果更新的是普通商品，同步免费贴纸状态（如果用户手动移除了免费贴纸，不自动添加）
        updatedItems = syncFreeStickers(updatedItems, userRemovedStickersRef.current);
      }
      return updatedItems;
    });
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
        if (hasOtherItems) {
          // 有其他商品时，第一个免费贴纸免费，额外的贴纸每个 $5
          const chargeableQuantity = Math.max(0, item.quantity - 1);
          return total + item.price * chargeableQuantity;
        } else {
          // 没有其他商品时，所有免费贴纸按原价 $5 收费
          return total + item.price * item.quantity;
        }
      }
      return total + item.price * item.quantity;
    }, 0);
  };

  const addFreeStickers = () => {
    userRemovedStickersRef.current = false; // 用户手动添加，重置标记
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

  const userRemovedStickers = () => {
    return userRemovedStickersRef.current;
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
        userRemovedStickers,
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
