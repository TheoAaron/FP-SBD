
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  maxStock?: number
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  appliedCoupon?: string
  discount?: number
}

export interface CouponCode {
  code: string
  discountPercent: number
  discountAmount?: number
  minOrderAmount?: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: string }
  | { type: 'CLEAR_CART' }
