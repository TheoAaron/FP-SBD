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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/bs`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        // Filter out invalid products
        const validProducts = data.filter((p: any) => 
          p && 
          p.id_produk && 
          p.nama_produk && 
          typeof p.harga === 'number'
        );

        const mapped = validProducts.map((p: any) => ({
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
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
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
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading best selling products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mt-8 sm:mt-12">        <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          {selectedCategory ? `Explore Our ${selectedCategory}` : 'Best Selling Products'}
        </h3>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="group border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-48 sm:h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain h-full w-full p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
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
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedCategory 
                  ? `No ${selectedCategory} products available` 
                  : 'No best selling products available'
                }
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedCategory 
                  ? `We don't have any ${selectedCategory} products at the moment.`
                  : 'We don\'t have any best selling products at the moment.'
                }
              </p>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
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
