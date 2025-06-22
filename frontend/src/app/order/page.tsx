// src/app/orders/page.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import RequireAuth from "@/components/RequireAuth"

interface OrderItem {
  id_order: string
  total_harga: number
  status_pembayaran: string
  status_pengiriman: string
  metode_pembayaran: string
  nomor_resi?: string
  tanggal_order: string
  total_items: number
  items: Array<{
    id_detail_order: string
    product_id: string
    product_name: string
    price: number
    quantity: number
    subtotal: number
    image?: string
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Get token from sessionStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('jwtToken')
    }
    return null
  }

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token) {
        setError('Please login to view your orders')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please login again - your session may have expired')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }        const data = await response.json()
        console.log('Orders data from backend:', data)
        console.log('First order structure:', data.orders?.[0])
        
        // Debug setiap field di order pertama
        if (data.orders?.[0]) {
          const firstOrder = data.orders[0]
          console.log('=== ORDER FIELDS DEBUG ===')
          console.log('id_order:', firstOrder.id_order, typeof firstOrder.id_order)
          console.log('total_harga:', firstOrder.total_harga, typeof firstOrder.total_harga)
          console.log('total_price:', firstOrder.total_price, typeof firstOrder.total_price)
          console.log('status_pembayaran:', firstOrder.status_pembayaran)
          console.log('status_pengiriman:', firstOrder.status_pengiriman)
          console.log('metode_pembayaran:', firstOrder.metode_pembayaran)
          console.log('tanggal_order:', firstOrder.tanggal_order)
          console.log('items length:', firstOrder.items?.length)
          console.log('=== END DEBUG ===')
        }
        
        if (data.success) {
          setOrders(data.orders || [])
        } else {
          throw new Error(data.message || 'Failed to load orders')
        }
        
      } catch (error) {
        console.error('Error loading orders:', error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Failed to load orders')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Order</span>
          </nav>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Orders Table */}
        {orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Order & Products
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Shipping Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">                  {orders.map((order) => (
                    <tr 
                      key={order.id_order} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/order/${order.id_order}`)}
                    >
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex flex-col space-y-3">                          {/* Order Info */}
                          <div className="text-sm font-medium text-gray-900">
                            Order #{order.id_order || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.tanggal_order ? new Date(order.tanggal_order).toLocaleDateString() : 'No date'}
                          </div>
                          
                          {/* First Product Preview */}
                          {order.items && order.items.length > 0 && order.items[0] && (
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-12 h-12">
                                <img
                                  src={order.items[0].image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'}
                                  alt={order.items[0].product_name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              </div>                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {order.items[0].product_name || 'Unknown Product'}
                                  {(order.total_items || 0) > 1 && (
                                    <span className="text-gray-500"> + {(order.total_items || 1) - 1} others</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.total_items || 0} item{(order.total_items || 0) > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          Rp. {(order.total_harga || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 uppercase">
                          {order.metode_pembayaran || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (order.status_pembayaran || '').toLowerCase() === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : (order.status_pembayaran || '').toLowerCase() === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status_pembayaran ? order.status_pembayaran.charAt(0).toUpperCase() + order.status_pembayaran.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (order.status_pengiriman || '').toLowerCase() === 'shipped' 
                            ? 'bg-blue-100 text-blue-800'
                            : (order.status_pengiriman || '').toLowerCase() === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status_pengiriman ? order.status_pengiriman.charAt(0).toUpperCase() + order.status_pengiriman.slice(1) : 'Unknown'}
                        </span>
                        {order.nomor_resi && (
                          <div className="text-xs text-gray-500 mt-1">
                            Tracking: {order.nomor_resi}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No orders found</div>
              <Link href="/product">
                <button className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">
                  Start Shopping
                </button>
              </Link>
            </div>
          )
        )}        {/* Return to Shop Button */}
        <div className="mt-8">
          <Link href="/product">
            <button className="px-8 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Return To Shop
            </button>
          </Link>
        </div>
      </div>
    </div>
    </RequireAuth>
  )
}