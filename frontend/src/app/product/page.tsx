'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CategorySection from "@/components/Category";
import StarRating from "@/components/StarRating";
import { formatImageUrl } from "@/utils/imageUtils";

function ProductContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products`;
      if (selectedCategory) {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }
      
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      console.log(url);
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal fetch produk');
        const data = await res.json();
        
        // Mapping field dari backend ke frontend
        const mapped = Array.isArray(data) ? await Promise.all(
          data.map(async (p: any) => {
            try {              // Fetch reviews from MongoDB for each product
              const reviewRes = await fetch(`http://localhost:8080/api/reviews/${p.id_produk}`);
              let real_rating = 0;
              let real_review_count = 0;
                if (reviewRes.ok) {
                const reviewData = await reviewRes.json();
                // Use the new structure
                const reviews = reviewData.reviews || [];
                real_review_count = reviewData.total_review || 0;
                
                if (reviews.length > 0) {
                  const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
                  real_rating = totalRating / reviews.length;
                }
              }
              
              return {
                id: p.id_produk,
                name: p.nama_produk,
                price: p.harga,
                image: formatImageUrl(p.image, '/tokit.svg'), 
                rating: real_rating,
                reviews: real_review_count,
              };
            } catch (error) {
              console.error(`Error processing product ${p.id_produk}:`, error);
              return {
                id: p.id_produk,
                name: p.nama_produk,
                price: p.harga,
                image: formatImageUrl(p.image, '/tokit.svg'), 
                rating: 0,
                reviews: 0,
              };
            }
          })
        ) : [];
        setProducts(mapped);
        setLoading(false);
      } catch (error) {
        setError('Gagal mengambil produk');
        setLoading(false);
      }
    };
    
    fetchProducts();
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
      ) : (          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-4">
            {products.map(product => (
              <Link href={`/product/${product.id_produk || product.id}`} key={product.id_produk || product.id}>
                <div className="group border rounded-lg p-3 sm:p-4 hover:shadow-md transition cursor-pointer">
                  <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-52 sm:h-64 overflow-hidden mb-3">
                    <img
                      src={product.image || '/shopit.svg'}
                      alt={product.name}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/shopit.svg';
                      }}
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
              </Link>
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
