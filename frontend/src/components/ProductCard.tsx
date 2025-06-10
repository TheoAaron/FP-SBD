// src/components/ProductCard.tsx
import Image from 'next/image'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

interface ProductCardProps {
  product: {
    id: string
    name: string
    image: string
    price: number
    oldPrice?: number
    stock: number
  }
  onEdit: () => void
  onDelete: () => void
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="relative bg-gray-100 rounded-lg p-6 group hover:shadow-md transition-shadow">
      {/* Edit and Delete Icons */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={onEdit}
          className="text-gray-500 hover:text-blue-600 p-1"
          aria-label="Edit product"
        >
          <FiEdit2 size={16} />
        </button>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={onDelete}
          className="text-gray-500 hover:text-red-600 p-1"
          aria-label="Delete product"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Product Image */}
      <div className="flex justify-center items-center h-32 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          width={120}
          height={120}
          className="object-contain max-h-full"
        />
      </div>

      {/* Product Info */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2 text-sm">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-red-500 font-semibold">
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
