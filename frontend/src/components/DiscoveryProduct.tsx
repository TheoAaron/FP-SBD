'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { UUID } from "crypto";
import { Product } from '@/types/product';

interface ExploreProductsProps {
  products: Product[];
}

export default function ExploreProducts({
  products,
}: ExploreProductsProps) {  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-8 bg-red-500 rounded"></div>
          <span className="text-red-500 font-medium">Our Products</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Explore Our Products</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id_produk}
            className="group relative border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
          >
            {/* Image */}
            <div className="relative bg-gray-100 rounded-lg h-52 mb-4 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.nama_produk}
                className="object-contain w-full h-full"
              />
              {/* Hover buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {/* Hover Add To Cart */}
              <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4">
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
                {product.harga && (
                  <span className="text-gray-400 line-through">${product.harga}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <StarRating rating={product.avg_rating} />
                <span className="text-gray-600 text-sm font-medium">{product.avg_rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({product.total_review})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link href="/product" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors">
          View All Products
        </Link>
      </div>
    </div>
  );
}
