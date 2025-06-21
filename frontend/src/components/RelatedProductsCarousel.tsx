'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { Product } from '@/lib/dummyProducts';

interface CarouselProps {
  products: Product[];
}

interface ProductWithReviews extends Product {
  real_rating?: number;
  real_review_count?: number;
}

export default function RelatedProductsCarousel({ products }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [productsWithReviews, setProductsWithReviews] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(true);

  const scroll = (dir: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    }
  };

  // Fetch reviews from MongoDB for each product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productsWithReviewData = await Promise.all(
          products.map(async (product) => {
            try {
              const response = await fetch(`http://localhost:8080/api/reviews/${product.id_produk}`);              if (response.ok) {
                const data = await response.json();
                console.log(`RelatedProducts reviews for ${product.id_produk}:`, data);
                
                // Use the new structure
                const reviews = data.reviews || [];
                const real_review_count = data.total_review || 0;
                
                let real_rating = 0;
                if (reviews.length > 0) {
                  const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
                  real_rating = totalRating / reviews.length;
                }
                
                return {
                  ...product,
                  real_rating,
                  real_review_count
                };
              } else {
                return {
                  ...product,
                  real_rating: 0,
                  real_review_count: 0
                };
              }
            } catch (error) {
              console.error(`Error fetching reviews for related product ${product.id_produk}:`, error);
              return {
                ...product,
                real_rating: 0,
                real_review_count: 0
              };
            }
          })
        );
        
        setProductsWithReviews(productsWithReviewData);
      } catch (error) {
        console.error('Error fetching reviews for related products:', error);
        setProductsWithReviews(products.map(p => ({ ...p, real_rating: 0, real_review_count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [products]);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md"
      >
        ‹
      </button>
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth py-2 no-scrollbar"
      >
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="min-w-[200px] flex-shrink-0 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-40 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (          productsWithReviews.map(prod => (
            <Link href={`/product/${prod.id_produk}`} key={prod.id_produk}>
              <div
                className="min-w-[200px] flex-shrink-0 group border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >              <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-40 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.nama_produk}
                  className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-text w-full h-full bg-gray-200 flex items-center justify-center text-gray-500';
                      fallback.textContent = 'No Image';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <h4 className="mt-2 font-medium text-lg text-gray-800">{prod.nama_produk}</h4>
              <p className="text-red-500 font-semibold mt-1">${prod.harga.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <StarRating rating={prod.real_rating ?? 0} />
                <span className="text-gray-600 text-sm">({prod.real_review_count ?? 0})</span>              </div>
            </div>
            </Link>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md"
      >
        ›
      </button>
    </div>
  );
}
