'use client';

import { useState, useCallback } from 'react';
import { CartItem, CartState } from './cart-types';

const validCoupons = {
  'SAVE10': { discountPercent: 10 },
  'SAVE20': { discountPercent: 20 },
  'WELCOME': { discountPercent: 15 }
};

export const useCart = () => {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    appliedCoupon: undefined,
    discount: 0
  });

  const calculateTotals = useCallback((items: CartItem[], discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
    const total = subtotal + shipping - discount;

    return { subtotal, shipping, total };
  }, []);

  const updateCartState = useCallback((items: CartItem[], appliedCoupon?: string, discount = 0) => {
    const { subtotal, shipping, total } = calculateTotals(items, discount);

    setCartState({
      items,
      subtotal,
      shipping,
      total,
      appliedCoupon,
      discount
    });
  }, [calculateTotals]);

  const setCartItems = useCallback((items: CartItem[]) => {
    updateCartState(items, cartState.appliedCoupon, cartState.discount);
  }, [updateCartState, cartState.appliedCoupon, cartState.discount]);

  const addItem = useCallback((newItem: CartItem) => {
    setCartState(prev => {
      const existingItem = prev.items.find(item => item.id === newItem.id);
      let newItems;

      if (existingItem) {

        newItems = prev.items.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxStock || 999) }
            : item
        );
      } else {

        newItems = [...prev.items, newItem];
      }

      const { subtotal, shipping, total } = calculateTotals(newItems, prev.discount);

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        total
      };
    });
  }, [calculateTotals]);

  const removeItem = useCallback((itemId: string) => {
    setCartState(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const { subtotal, shipping, total } = calculateTotals(newItems, prev.discount);

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        total
      };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartState(prev => {
      const newItems = prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxStock || 999) }
          : item
      );

      const { subtotal, shipping, total } = calculateTotals(newItems, prev.discount);

      return {
        ...prev,
        items: newItems,
        subtotal,
        shipping,
        total
      };
    });
  }, [calculateTotals, removeItem]);

  const applyCoupon = useCallback((couponCode: string): boolean => {
    const coupon = validCoupons[couponCode as keyof typeof validCoupons];

    if (!coupon) {
      return false;
    }

    const discountAmount = (cartState.subtotal * coupon.discountPercent) / 100;
    updateCartState(cartState.items, couponCode, discountAmount);

    return true;
  }, [cartState.subtotal, cartState.items, updateCartState]);

  const removeCoupon = useCallback(() => {
    updateCartState(cartState.items, undefined, 0);
  }, [cartState.items, updateCartState]);

  const clearCart = useCallback(() => {
    setCartState({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      appliedCoupon: undefined,
      discount: 0
    });
  }, []);

  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartState,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    setCartItems,
    itemCount
  };
};
