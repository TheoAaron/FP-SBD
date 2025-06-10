// src/app/admin/products/components/ProductCard.tsx
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
    <div className="relative bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow">
      <div className="absolute right-3 top-3 flex gap-2">
        <button
          onClick={onEdit}
          className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full bg-white shadow-sm"
          aria-label="Edit product"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 p-1.5 rounded-full bg-white shadow-sm"
          aria-label="Delete product"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      <div className="aspect-square mb-4 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <h3 className="font-medium mb-2">{product.name}</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600 font-semibold text-lg">
          ${product.price}
        </span>
        {product.oldPrice && (
          <span className="text-gray-400 line-through text-sm">
            ${product.oldPrice}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Stock: {product.stock}
      </div>
    </div>
  )
}
