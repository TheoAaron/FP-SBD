// src/app/orders/page.tsx
"use client"

import Link from "next/link"
import { useState } from "react"

interface OrderItem {
  id: string
  name: string
  image: string
  quantity: number
  additionalItems: number
  subtotal: number
  paymentMethod: string
  paymentStatus: string
  shippingStatus: string
}

const mockOrders: OrderItem[] = [
  {
    id: "1",
    name: "Item 1",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    quantity: 1,
    additionalItems: 4, 
    subtotal: 550,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    shippingStatus: "Shipped"
  }
]

export default function OrdersPage() {
  const [orders] = useState<OrderItem[]>(mockOrders)

  return (
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

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {/* Gambar Produk */}
                        <div className="flex-shrink-0 w-16 h-16">
                          <img
                            src={order.image}
                            alt={order.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-contain rounded-lg bg-red-100"
                          />
                        </div>
                        {/* Label Item dengan format "Item 1 +2" */}
                        <div className="text">
                          <div className="text-sm font-medium text-gray-900">
                            {order.name}
                            {order.additionalItems > 0 && (
                              <span> + {order.additionalItems} others</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.subtotal}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentStatus === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.shippingStatus === 'Shipped' 
                          ? 'bg-blue-100 text-blue-800'
                          : order.shippingStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.shippingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return to Shop Button */}
        <div className="mt-8">
          <Link href="/">
            <button className="px-8 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Return To Shop
            </button>
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No orders found</div>
            <Link href="/">
              <button className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}