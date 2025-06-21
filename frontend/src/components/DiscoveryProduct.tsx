'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { UUID } from "crypto";
import { Product } from '@/types/product';

interface ExploreProductsProps {
  products: Product[];
}


export default function ExploreProducts({ products }: ExploreProductsProps) {
  // Filter out invalid products
  const validProducts = products?.filter(product => 
    product && 
    product.id_produk && 
    product.nama_produk && 
    typeof product.harga === 'number'
  ) || [];
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-6 sm:h-8 bg-red-500 rounded"></div>
          <span className="text-red-500 font-medium text-sm sm:text-base">Our Products</span>
        </div>        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Our Products</h2>
      </div>

      {/* Grid */}
      {validProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {validProducts.map((product) => (
            <div
              key={product.id_produk}
              className="group relative border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
            >              {/* Image */}
              <div className="relative bg-gray-100 rounded-lg h-48 sm:h-56 mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={product.nama_produk}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                
                {/* Desktop: Hover buttons */}
                <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                {/* Mobile: Always visible buttons */}
                <div className="absolute top-2 right-2 flex sm:hidden flex-col gap-1">
                  <button className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md active:bg-gray-100 touch-manipulation">
                    <Heart className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md active:bg-gray-100 touch-manipulation">
                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
                
                {/* Desktop: Hover Add To Cart */}
                <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4 hidden sm:block">
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900 text-sm">{product.nama_produk}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-500 font-semibold">${product.harga}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <StarRating rating={product.avg_rating ?? 0} />
                  <span className="text-gray-600 text-sm font-medium">{(product.avg_rating ?? 0).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({product.total_review ?? 0})</span>
                </div>
              </div>

              {/* Mobile: Always visible Add To Cart */}
              <div className="block sm:hidden">
                <button className="w-full bg-black text-white py-2.5 rounded hover:bg-gray-800 active:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">Add To Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">No products available</p>
            <p className="text-sm text-gray-400">Please check back later or browse our other products.</p>
          </div>
        </div>
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/product" className="bg-red-500 hover:bg-red-600 active:bg-red-600 text-white px-6 py-2.5 sm:py-2 rounded transition-colors touch-manipulation">
          View All Products
        </Link>
      </div>
    </div>
  );
}
