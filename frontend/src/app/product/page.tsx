'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CategorySection from "@/components/Category";
import StarRating from "@/components/StarRating";
import { formatImageUrl } from "@/utils/imageUtils";

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle product click
  const handleProductClick = (productId: number | string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products`;
    
    // Handle both category and search parameters
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log(url)
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Gagal fetch produk');
        return res.json();
      })
      .then(data => {
        // Mapping field dari backend ke frontend
        const mapped = Array.isArray(data) ? data.map((p) => ({
          id: p.id_produk || p.id,
          name: p.nama_produk || p.name,
          price: p.harga || p.price,
          image: p.image || "/tokit.svg", 
          rating: p.avg_rating || p.rating || 0,
          reviews: p.total_review || p.reviews || 0,
        })) : [];
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal mengambil produk');
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategorySection />
      </Suspense>

      <div className="mt-8 sm:mt-12">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          {selectedCategory ? `Explore Our ${selectedCategory}` : 'All Products'}
        </h3>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <img src="https://res.cloudinary.com/dlwxkdjek/image/upload/v1750433799/capybara-turu_ledsfn.jpg" alt="Kosong" className="w-48 h-48 object-contain mb-6" />
          <div className="text-center py-8 text-gray-700 font-medium mb-2">Produk Tidak Ditemukan</div>
        </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-4">
            {products.map(product => (
              <div key={product.id} className="group border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-48 sm:h-64 overflow-hidden">
                  <img
                    src={product.image || '/shopit.svg'}
                    alt={product.name}
                    className="object-contain h-full w-full p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  />
                </div>
                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-base sm:text-lg text-gray-800 line-clamp-2 mb-2">{product.name}</h4>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                    <p className="text-red-500 font-semibold text-base sm:text-lg">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating rating={product.rating || 0} />
                    <span className="text-gray-600 text-sm font-medium">{(product.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({product.reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductContent />
    </Suspense>
  );
}