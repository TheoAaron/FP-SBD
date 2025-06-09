// src/app/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../components/useCart'
import { CartItem } from '../../components/cart-types'

const mockInitialItems: CartItem[] = [
  {
    id: '1',
    name: 'LCD Monitor',
    price: 650,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    maxStock: 5
  },
  {
    id: '2',
    name: 'Hi Gamepad',
    price: 550,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    maxStock: 10
  }
]

export default function Cart() {
  const {
    cartState,
    updateQuantity,
    removeItem,
    applyCoupon,
    itemCount,
    setCartItems
  } = useCart()
  useEffect(() => {
  // Inisialisasi cart dengan mock data
  setCartItems(mockInitialItems)
}, [setCartItems])


  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
   // Initialize cart with mock data (in real app, load from localStorage or API)
  useEffect(() => {
    // This would typically load cart from localStorage or API
    // For demo purposes, we're using mock data
  }, [])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const item = cartState.items.find((item: CartItem) => item.id === id)
    if (item && item.maxStock && newQuantity > item.maxStock) {
      alert(`Only ${item.maxStock} items available in stock`)
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code')
      return
    }

    setIsLoading(true)
    const success = applyCoupon(couponCode)

    setTimeout(() => {
      if (success) {
        setCouponMessage('Coupon applied successfully!')
        setCouponCode('')
      } else {
        setCouponMessage('Invalid coupon code')
      }
      setIsLoading(false)
    }, 500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to get started</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-500 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Cart ({itemCount} items)</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          {/* Cart Table Header */}
          <div className="hidden md:grid grid-cols-4 gap- py-4 border-b border-gray-200 font-medium text-gray-900">
            <div>Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Subtotal</div>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartState.items.map((item: CartItem) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Red placeholder for product image */}
                    {/* <div className="w-8 h-8 bg-red-500 rounded"></div> */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"></img>
                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.maxStock && (
                      <p className="text-sm text-gray-500">In stock: {item.maxStock}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-gray-900 font-medium md:text-center">
                  <span className="md:hidden font-normal text-gray-600">Price: </span>
                  {formatCurrency(item.price)}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center md:justify-center">
                  <span className="md:hidden mr-2 text-gray-600">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity.toString().padStart(2, '0')}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value) || 1
                        handleQuantityChange(item.id, newQty)
                      }}
                      className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
                      min="1"
                      max={item.maxStock}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-gray-900 font-medium md:text-center">
                  <span className="md:hidden font-normal text-gray-600">Subtotal: </span>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Return To Shop
            </Link>
            <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Update Cart
            </button>
          </div>

          {/* Coupon Section */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Applying...' : 'Apply Coupon'}
              </button>
            </div>
            {couponMessage && (
              <p className={`mt-2 text-sm ${couponMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                {couponMessage}
              </p>
            )}
          </div>
        </div>

        {/* Cart Total Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Cart Total</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(cartState.subtotal)}</span>
              </div>

              {cartState.discount && cartState.discount > 0 && (
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">
                    Discount ({cartState.appliedCoupon}):
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(cartState.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(cartState.total)}</span>
              </div>
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-500 transition-colors font-medium">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Total items: <span className="font-medium">{itemCount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

