// hooks/useCart.ts
import { useState, useCallback } from 'react'
import { CartItem, CartState } from './cart-types'

export const useCart = () => {

  
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
  })

  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 0 ? 0 : 0 // Free shipping
    const discount = cartState.discount || 0
    const total = subtotal + shipping - discount

    return { subtotal, shipping, total }
  }, [cartState.discount])

  const addItem = useCallback((newItem: CartItem) => {
    setCartState((prev: CartState) => {
      const existingItem = prev.items.find((item: CartItem) => item.id === newItem.id)
      let updatedItems: CartItem[]

      if (existingItem) {
        updatedItems = prev.items.map((item: CartItem) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      } else {
        updatedItems = [...prev.items, newItem]
      }

      const totals = calculateTotals(updatedItems)
      return {
        ...prev,
        items: updatedItems,
        ...totals
      }
    })
  }, [calculateTotals])

  const removeItem = useCallback((itemId: string) => {
    setCartState((prev: CartState) => {
      const updatedItems = prev.items.filter((item: CartItem) => item.id !== itemId)
      const totals = calculateTotals(updatedItems)

      return {
        ...prev,
        items: updatedItems,
        ...totals
      }
    })
  }, [calculateTotals])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return

    setCartState((prev: CartState) => {
      const updatedItems = prev.items.map((item: CartItem) =>
        item.id === itemId ? { ...item, quantity } : item
      )
      const totals = calculateTotals(updatedItems)

      return {
        ...prev,
        items: updatedItems,
        ...totals
      }
    })
  }, [calculateTotals])

  const applyCoupon = useCallback((couponCode: string) => {
    // Mock coupon logic - in real app, this would call an API
    const mockCoupons: Record<string, number> = {
      'SAVE10': 0.1,
      'SAVE20': 0.2,
      'WELCOME': 0.15
    }

    const discountPercent = mockCoupons[couponCode.toUpperCase()]
    if (discountPercent) {
      const discount = cartState.subtotal * discountPercent
      setCartState((prev: CartState) => ({
        ...prev,
        appliedCoupon: couponCode,
        discount,
        total: prev.subtotal + prev.shipping - discount
      }))
      return true
    }
    return false
  }, [cartState.subtotal])

  const clearCart = useCallback(() => {
    setCartState({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0
    })
  }, [])

  const setCartItems = useCallback((items: CartItem[]) => {
  const totals = calculateTotals(items)
  setCartState((prev: CartState) => ({
    ...prev,
    items,
    ...totals
  }))
}, [calculateTotals])

  return {
    cartState,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    clearCart,
    setCartItems,
    itemCount: cartState.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  }
}
