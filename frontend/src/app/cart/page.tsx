// src/app/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../components/useCart'
import { CartItem } from '../../components/cart-types'
import { FiTrash2 } from 'react-icons/fi'

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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb - Hidden on mobile */}
        <nav className="hidden sm:flex text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Cart</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Shopping Cart ({itemCount} items)
        </h1>

        {cartState.items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4">
                Your cart is empty
              </h2>              <p className="text-gray-600 mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/product"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items - Mobile Stack, Desktop Side by Side */}
            <div className="flex-1">
              {/* Desktop Table Header - Hidden on mobile */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow-sm mb-4 font-medium text-gray-600">
                <div className="col-span-2">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Subtotal</div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Mobile Layout */}
                    <div className="sm:hidden p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-red-600 font-semibold">${item.price}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-sm">{item.quantity}</span>                              <button
                                onClick={() => updateQuantity(item.id, Math.min(item.maxStock || 999, item.quantity + 1))}
                                className="p-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid sm:grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-red-600 font-semibold">${item.price}</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center border rounded max-w-32 mx-auto">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.maxStock || 999, item.quantity + 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-center flex items-center justify-center gap-4">
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                <Link
                  href="/product"
                  className="text-center sm:text-left px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return To Shop
                </Link>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Update Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Cart Total</h2>
                
                {/* Coupon Section */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isLoading}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Applying...' : 'Apply Coupon'}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`mt-2 text-sm ${couponMessage.includes('success') || couponMessage.includes('applied') ? 'text-green-600' : 'text-red-600'}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* Order Summary Details */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${cartState.subtotal.toFixed(2)}</span>
                  </div>
                    {(cartState.discount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${(cartState.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{cartState.shipping === 0 ? 'Free' : `$${cartState.shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${cartState.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full mt-6 bg-red-500 text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}