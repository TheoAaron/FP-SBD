'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StarRating from '@/components/StarRating';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  quantity: number;
}

function ProductContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/bs`
        );
        const data = await res.json();

        const mapped = data.map((p: any) => ({
          id: p.id_produk,
          name: p.nama_produk,
          price: p.harga,
          category: p.kategori || 'Uncategorized',
          image: p.image || '/placeholder.png',
          rating: p.avg_rating ?? 0,
          reviews: p.total_review ?? 0,
          quantity: p.total_quantity ?? 0,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch best selling products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mt-8 sm:mt-12">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          {selectedCategory ? `Explore Our ${selectedCategory}` : 'Best Selling Products'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="group border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-48 sm:h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-full w-full p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-3 sm:mt-4">
                <h4 className="font-medium text-base sm:text-lg text-gray-800 line-clamp-2 mb-2">{product.name}</h4>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                  <p className="text-red-500 font-semibold text-base sm:text-lg">${product.price}</p>
                  <span className="text-gray-400 text-sm">({product.quantity} terjual)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
      <ProductContent />
    </Suspense>
  );
}
