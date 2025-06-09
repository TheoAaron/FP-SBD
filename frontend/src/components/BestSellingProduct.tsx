'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import StarRating from "@/components/StarRating";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  quantity?: number;
}

interface BestSellingProductsProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "The north coat",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    price: 260,
    originalPrice: 360,
    rating: 5,
    reviews: 65
  },
  {
    id: 2,
    name: "Gucci duffle bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    price: 960,
    originalPrice: 1160,
    rating: 5,
    reviews: 65
  },
  {
    id: 3,
    name: "RGB liquid CPU Cooler",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=300&fit=crop",
    price: 160,
    originalPrice: 170,
    rating: 5,
    reviews: 65
  },
  {
    id: 4,
    name: "Small BookSelf",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    price: 360,
    rating: 5,
    reviews: 65
  }
];

export default function BestSellingProducts({
  products = defaultProducts,
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
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors">
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            {/* Product Image Container */}
            <div className="relative bg-gray-100 rounded-lg p-6 mb-4 h-64 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
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
              <h3 className="font-medium text-gray-900">{product.name}</h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-medium">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-gray-600 text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({product.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
