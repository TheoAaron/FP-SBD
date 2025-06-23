import React from 'react'
import { CartItem as CartItemType } from './cart-types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  formatCurrency: (amount: number) => string
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  formatCurrency
}: CartItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (item.maxStock && newQuantity > item.maxStock) {
      alert(`Only ${item.maxStock} items available in stock`)
      return
    }
    onUpdateQuantity(item.id, newQuantity)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
      {}
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {}
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          {}
          <button
            onClick={() => onRemove(item.id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors"
            aria-label={`Remove ${item.name} from cart`}
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

      {}
      <div className="text-gray-900 font-medium md:text-center">
        <span className="md:hidden font-normal text-gray-600">Price: </span>
        {formatCurrency(item.price)}
      </div>

      {}
      <div className="flex items-center md:justify-center">
        <span className="md:hidden mr-2 text-gray-600">Qty:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity.toString().padStart(2, '0')}
            onChange={(e) => {
              const newQty = parseInt(e.target.value) || 1
              handleQuantityChange(newQty)
            }}
            className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
            min="1"
            max={item.maxStock}
            aria-label="Item quantity"
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.maxStock ? item.quantity >= item.maxStock : false}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {}
      <div className="text-gray-900 font-medium md:text-center">
        <span className="md:hidden font-normal text-gray-600">Subtotal: </span>
        {formatCurrency(item.price * item.quantity)}
      </div>
    </div>
  )
}
