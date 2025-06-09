'use client';

import { useSearchParams } from 'next/navigation';
import CategorySection from "@/components/Category";
import StarRating from "@/components/StarRating";

const products = [
  { id: 1, category: 'Phones', name: 'iPhone 15 Pro', price: 1899, image: 'https://images.unsplash.com/photo-1695026139549-8d71131a7071?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 98 },
  { id: 2, category: 'Phones', name: 'Samsung Galaxy S24 Ultra', price: 1799, image: 'https://images.unsplash.com/photo-1709420138991-348530869ae2?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 75 },
  { id: 3, category: 'Computers', name: 'ASUS FHD Gaming Laptop', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', price: 960, originalPrice: 1160, rating: 4, reviews: 65 },
  { id: 4, category: 'Computers', name: 'IPS LCD Gaming Monitor', image: 'https://images.unsplash.com/photo-1587202372775-a729b4e5a06d?auto=format&fit=crop&w=300&q=80', price: 1160, rating: 5, reviews: 65 },
  { id: 5, category: 'SmartWatch', name: 'Apple Watch Series 9', price: 499, image: 'https://images.unsplash.com/photo-1696290745913-92198fa4a679?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 120 },
  { id: 6, category: 'Camera', name: 'Canon EOS R6', price: 2499, image: 'https://images.unsplash.com/photo-1616782098492-0863863a492f?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 88 },
  { id: 7, category: 'HeadPhones', name: 'Sony WH-1000XM5', price: 399, image: 'https://images.unsplash.com/photo-1627916538174-85514a696238?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 210 },
  { id: 8, category: 'Gaming', name: 'RGB liquid CPU Cooler', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=300&q=80', price: 1960, rating: 4, reviews: 45 },
  { id: 9, category: 'Gaming', name: 'AK-900 Wired Keyboard', image: 'https://images.unsplash.com/photo-1555617983-1f174153cc6e?auto=format&fit=crop&w=300&q=80', price: 200, rating: 5, reviews: 65 },
  { id: 10, category: 'Gaming', name: 'HAVIT HV-G92 Gamepad', image: 'https://images.unsplash.com/photo-1604392002974-02e716b36dc6?auto=format&fit=crop&w=300&q=80', price: 560, rating: 5, reviews: 65 },
];

export default function ProductPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <CategorySection />

      <div className="mt-12">
        <h3 className="text-3xl font-bold mb-8">
          {selectedCategory ? `Explore Our ${selectedCategory}` : 'All Products'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group border rounded-lg p-4 hover:shadow-md transition">
              <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-lg text-gray-800">{product.name}</h4>
                <div className="flex items-center justify-between my-2">
                  <p className="text-red-500 font-semibold text-lg">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-gray-400 line-through">${product.originalPrice}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-gray-600 text-sm font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
