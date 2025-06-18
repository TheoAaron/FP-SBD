'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
// import { useState } from "react";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { Product } from '@/types/product';




interface BestSellingProductsProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}


export default function BestSellingProducts({
  products,
  title = "Best Selling Products",
  subtitle = "This Month"
}: BestSellingProductsProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-red-500 rounded"></div>
          <span className="text-red-500 font-medium">{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <Link href="/product" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors">
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product.id_produk} className="group">
            {/* Product Image Container */}
            <div className="relative bg-gray-100 rounded-lg p-6 mb-4 h-64 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.nama_produk}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4">
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add To Cart
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">{product.nama_produk}</h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-medium">${product.harga}</span>
                {/* {product.harga && (
                  <span className="text-gray-400 line-through">${product.harga}</span>
                )} */}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={product.avg_rating} />
                <span className="text-gray-600 text-sm font-medium">{product.avg_rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({product.total_review})</span>
              </div>
            </div>
          </div>
        ))}
        </div>            
    </div>
  );
}
