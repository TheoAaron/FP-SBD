'use client';

import { ShoppingCart, Trash2, Eye } from "lucide-react";
import StarRating from "@/components/StarRating";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
}

const wishlist: Product[] = [
  {
    id: 1,
    name: "Gucci duffle bag",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=300&q=80",
    price: 960,
    originalPrice: 1160,
  },
  {
    id: 2,
    name: "RGB liquid CPU Cooler",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=300&q=80",
    price: 1960
  },
  {
    id: 3,
    name: "GP11 Shooter USB Gamepad",
    image: "https://images.unsplash.com/photo-1606813903172-60aaed29f729?auto=format&fit=crop&w=300&q=80",
    price: 550
  },
  {
    id: 4,
    name: "Quilted Satin Jacket",
    image: "https://images.unsplash.com/photo-1602810318383-6e44b98d07a3?auto=format&fit=crop&w=300&q=80",
    price: 750
  }
];

const lastView: Product[] = [
  {
    id: 5,
    name: "ASUS FHD Gaming Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    price: 960,
    originalPrice: 1160,
    rating: 4,
    reviews: 65
  },
  {
    id: 6,
    name: "IPS LCD Gaming Monitor",
    image: "https://images.unsplash.com/photo-1587202372775-a729b4e5a06d?auto=format&fit=crop&w=300&q=80",
    price: 1160,
    rating: 5,
    reviews: 65
  },
  {
    id: 7,
    name: "HAVIT HV-G92 Gamepad",
    image: "https://images.unsplash.com/photo-1604392002974-02e716b36dc6?auto=format&fit=crop&w=300&q=80",
    price: 560,
    rating: 5,
    reviews: 65
  },
  {
    id: 8,
    name: "AK-900 Wired Keyboard",
    image: "https://images.unsplash.com/photo-1555617983-1f174153cc6e?auto=format&fit=crop&w=300&q=80",
    price: 200,
    rating: 5,
    reviews: 65
  }
];

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Wishlist */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Wishlist ({wishlist.length})</h2>
        <button className="border px-4 py-2 rounded hover:bg-gray-100">Move All To Bag</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {wishlist.map(product => (
          <div key={product.id} className="border rounded-lg p-4 group">
            <div className="relative h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group mb-4">
              <button className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black hover:bg-gray-200 transition-colors z-10">
                <Trash2 className="w-5 h-5" />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="object-contain w-full h-full p-4"
              />
              <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4">
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add To Cart
                </button>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-500 font-semibold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Last View Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-1 h-6 bg-red-500 rounded"></div>
        <h3 className="text-lg font-semibold">Last View</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {lastView.map(product => (
          <div key={product.id} className="border rounded-lg p-4 group">
            <div className="relative h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group mb-4">
              <button className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black hover:bg-gray-200 transition-colors z-10">
                <Eye className="w-5 h-5" />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="object-contain w-full h-full p-4"
              />
              <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4">
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add To Cart
                </button>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-500 font-semibold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <StarRating rating={product.rating || 0} />
              <span className="text-gray-600 text-sm font-medium">{product.rating?.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviews})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}