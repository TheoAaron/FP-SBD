'use client';

import { Heart, Eye, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  colors?: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Breed Dry Dog Food",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=300&q=80",
    price: 100,
    rating: 4,
    reviews: 35
  },
  {
    id: 2,
    name: "CANON EOS DSLR Camera",
    image: "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?auto=format&fit=crop&w=300&q=80",
    price: 360,
    rating: 4,
    reviews: 95
  },
  {
    id: 3,
    name: "ASUS FHD Gaming Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    price: 700,
    rating: 5,
    reviews: 325
  },
  {
    id: 4,
    name: "Curology Product Set",
    image: "https://images.unsplash.com/photo-1588776814546-4eb2f0daea42?auto=format&fit=crop&w=300&q=80",
    price: 500,
    rating: 4,
    reviews: 145
  },
  {
    id: 5,
    name: "Kids Electric Car",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=300&q=80",
    price: 960,
    rating: 5,
    reviews: 65,
    isNew: true,
    colors: ["#000", "#f00"]
  },
  {
    id: 6,
    name: "Jr. Zoom Soccer Cleats",
    image: "https://images.unsplash.com/photo-1606813903192-149652f93ad4?auto=format&fit=crop&w=300&q=80",
    price: 1160,
    rating: 4,
    reviews: 35
  },
  {
    id: 7,
    name: "GP11 Shooter USB Gamepad",
    image: "https://images.unsplash.com/photo-1606813903172-60aaed29f729?auto=format&fit=crop&w=300&q=80",
    price: 660,
    rating: 4,
    reviews: 55,
    isNew: true,
    colors: ["#000", "#f00", "#0f0"]
  },
  {
    id: 8,
    name: "Quilted Satin Jacket",
    image: "https://images.unsplash.com/photo-1602810318383-6e44b98d07a3?auto=format&fit=crop&w=300&q=80",
    price: 660,
    rating: 4,
    reviews: 55,
    colors: ["#004", "#faa"]
  }
];

export default function ExploreProducts() {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

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
            key={product.id}
            className="group relative border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
          >
            {/* NEW badge */}
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                NEW
              </span>
            )}

            {/* Image */}
            <div className="relative bg-gray-100 rounded-lg h-52 mb-4 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
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
              <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-500 font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-400">({product.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors">
          View All Products
        </button>
      </div>
    </div>
  );
}
