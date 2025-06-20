// src/app/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../components/useCart'
import { CartItem } from '../../components/cart-types'
import { FiTrash2 } from 'react-icons/fi'

export default function Cart() {
  const {
    cartState,
    updateQuantity,
    removeItem,
    itemCount,
    setCartItems
  } = useCart()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)  // Get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('jwtToken')
    }
    return null
  }  // Load cart data from API
  useEffect(() => {
    const loadCartData = async () => {
      setIsLoading(true)
      setError(null)
      
      const token = getAuthToken()
      console.log('Token found:', token ? 'Yes' : 'No') // Debug log
      
      if (!token) {
        setError('Please login to view your cart')
        setIsLoading(false)
        return
      }

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/cart`
        console.log('Making request to:', apiUrl) // Debug log
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Response status:', response.status) // Debug log
        console.log('Response ok:', response.ok) // Debug log

        if (!response.ok) {
          const errorText = await response.text()
          console.log('Error response:', errorText) // Debug log
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }        const data = await response.json()
        console.log('Cart data from backend:', data) // Debug log
        
        // Transform API data to match CartItem interface
        // Backend now returns enriched data: { id_user, produk: [{ product_id, qty, name, price, image, stock }] }
        const cartItems: CartItem[] = (data.produk || []).map((item: any) => ({
          id: item.product_id,
          name: item.name || `Product ${item.product_id}`,
          price: parseFloat(item.price || 0),
          quantity: parseInt(item.qty || 1),
          image: item.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
          maxStock: parseInt(item.stock || 999)
        }))

        setCartItems(cartItems)
        
      } catch (error) {
        console.error('Error loading cart data:', error)
          // More specific error messages
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            setError('Please login again - your session may have expired')
          } else if (error.message.includes('404')) {
            // 404 is normal for empty cart, don't show error
            setCartItems([]) // Set empty cart for 404
            setError(null) // Clear any error for empty cart
          } else if (error.message.includes('Failed to fetch')) {
            setError('Unable to connect to server. Please check your internet connection.')
          } else {
            setError(`Failed to load cart: ${error.message}`)
          }
        } else {
          setError('Failed to load cart data')
        }
        
        // Set empty cart on error (except for 404 which is handled above)
        if (!(error instanceof Error) || !error.message.includes('404')) {
          setCartItems([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCartData()
  }, [setCartItems])

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])
  // Update cart item quantity in local state only
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
    setHasUnsavedChanges(true)
  }

  // Remove cart item from local state only
  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    setHasUnsavedChanges(true)
  }
  // Save all cart changes to backend
  const saveCartToBackend = async () => {
    const token = getAuthToken()
    if (!token) {
      setError('Please login to save cart changes')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      // Transform cart items back to backend format
      const produk = cartState.items.map(item => ({
        product_id: item.id,
        qty: item.quantity
      }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ produk })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setHasUnsavedChanges(false)
      alert('Cart updated successfully!')
      
    } catch (error) {
      console.error('Error saving cart:', error)
      setError('Failed to save cart changes')
    } finally {
      setIsSaving(false)
    }
  }
  // Refresh cart data from backend (reload from server)
  const refreshCart = async () => {
    setIsLoading(true)
    setError(null)
    
    const token = getAuthToken()
    if (!token) {
      setError('Please login to refresh cart')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }      const data = await response.json()
      
      // Transform API data to match CartItem interface
      // Backend now returns enriched data: { id_user, produk: [{ product_id, qty, name, price, image, stock }] }
      const cartItems: CartItem[] = (data.produk || []).map((item: any) => ({
        id: item.product_id,
        name: item.name || `Product ${item.product_id}`,
        price: parseFloat(item.price || 0),
        quantity: parseInt(item.qty || 1),
        image: item.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
        maxStock: parseInt(item.stock || 999)
      }))

      setCartItems(cartItems)
      setHasUnsavedChanges(false) // Reset unsaved changes after refresh
      
    } catch (error) {
      console.error('Error refreshing cart:', error)
      setError('Failed to refresh cart data')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Shopping Cart
          </h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
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

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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
                          
                          <div className="flex items-center justify-between mt-3">                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-sm">{item.quantity}</span>                              <button
                                onClick={() => handleUpdateQuantity(item.id, Math.min(item.maxStock || 999, item.quantity + 1))}
                                className="p-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
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
                      
                      <div className="text-center">                        <div className="flex items-center justify-center border rounded max-w-32 mx-auto">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, Math.min(item.maxStock || 999, item.quantity + 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                        <div className="text-center flex items-center justify-center gap-4">
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                <Link
                  href="/product"
                  className="text-center sm:text-left px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return To Shop
                </Link>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {hasUnsavedChanges && (
                    <div className="text-sm text-orange-600 flex items-center justify-center sm:justify-start px-2">
                      ⚠️ Unsaved changes
                    </div>
                  )}
                  
                  <button 
                    onClick={refreshCart}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Refresh Cart'}
                  </button>
                  
                  {hasUnsavedChanges && (
                    <button 
                      onClick={saveCartToBackend}
                      disabled={isSaving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Cart Total</h2>
                
                

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
                </div>                {/* Checkout Button */}
                {hasUnsavedChanges ? (
                  <button
                    onClick={() => {
                      if (confirm('You have unsaved changes. Please save your cart before proceeding to checkout.')) {
                        saveCartToBackend()
                      }
                    }}
                    className="block w-full mt-6 bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Save Changes First
                  </button>
                ) : (
                  <Link
                    href="/checkout"
                    className="block w-full mt-6 bg-red-500 text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Proceed to checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}