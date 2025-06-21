// src/components/ProductCard.tsx
import Image from 'next/image'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Product } from '../types/product'

interface ProductCardProps {
  product: Product
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
      </div>      {/* Product Image */}
      <div className="flex justify-center items-center h-32 sm:h-40 mb-3 sm:mb-4 mt-6 sm:mt-4 bg-white rounded-md overflow-hidden">
        <img
          src={product.image}
          alt={product.nama_produk}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-text')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-text w-full h-full bg-gray-200 flex items-center justify-center text-gray-500';
              fallback.textContent = 'No Image';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      {/* Product Info */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
          {product.nama_produk}
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-red-500 font-semibold text-sm sm:text-base">
            ${product.harga}
          </span>
          {/* {product.harga && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ${product.harga}
            </span>
          )} */}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-1">
          Stock: {product.stock}
        </div>
      </div>
    </div>
  )
}
