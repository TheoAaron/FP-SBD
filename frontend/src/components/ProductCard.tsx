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
    <div className="relative bg-gray-100 rounded-lg p-4 sm:p-6 group hover:shadow-md transition-shadow">
      {/* Edit Icon - Kiri Atas */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
        <button
          onClick={onEdit}
          className="text-gray-400 hover:text-blue-600 active:text-blue-600 p-1.5 sm:p-1 transition-colors touch-manipulation"
          aria-label="Edit product"
        >
          <FiEdit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
      
      {/* Delete Icon - Kanan Atas */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 active:text-red-600 p-1.5 sm:p-1 transition-colors touch-manipulation"
          aria-label="Delete product"
        >
          <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* Product Image */}
      <div className="flex justify-center items-center h-28 sm:h-32 mb-3 sm:mb-4 mt-6 sm:mt-4">
        <Image
          src={product.image}
          alt={product.name}
          width={120}
          height={120}
          className="object-contain max-h-full w-auto"
        />
      </div>

      {/* Product Info */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-red-500 font-semibold text-sm sm:text-base">
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ${product.oldPrice}
            </span>
          )}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-1">
          Stock: {product.stock}
        </div>
      </div>
    </div>
  )
}
