'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
import StarRating from "@/components/StarRating";
import Link from "next/link";

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
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-1 h-6 sm:h-8 bg-red-500 rounded"></div>
            <span className="text-red-500 font-medium text-sm sm:text-base">{subtitle}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <Link 
            href="/product" 
            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded transition-colors text-center text-sm sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              {/* Product Image Container */}
              <div className="relative bg-gray-100 rounded-lg p-4 sm:p-6 mb-3 sm:mb-4 h-48 sm:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Action Buttons - Always visible on mobile, hover on desktop */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                </div>

                {/* Mobile Add to Cart Button */}
                <div className="absolute bottom-2 left-2 right-2 sm:hidden">
                  <button className="w-full bg-black text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Desktop Add to Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 hidden sm:block">
                  <button className="w-full bg-black text-white py-2 px-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 hover:bg-gray-800">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1 sm:space-y-2">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-red-500 font-semibold text-sm sm:text-base">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-xs sm:text-sm">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ({product.reviews})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
