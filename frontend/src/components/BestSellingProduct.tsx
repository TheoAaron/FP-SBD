'use client';
import { Heart, Eye, ShoppingCart } from "lucide-react";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { useEffect, useState } from 'react';
// import { Product } from '@/types/product';
// 


interface Product {
  id_produk: number;
  nama_produk: string;
  harga: number;
  image: string;
  avg_rating?: number;
  total_review?: number;
  total_quantity?: number;
  // Add other fields as necessary
}

interface ProductWithReviews extends Product {
  real_rating?: number;
  real_review_count?: number;
}

interface BestSellingProductsProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}


export default function BestSellingProducts({
  products,
  title = "Best Selling Products",
  subtitle = "This Month"
}: BestSellingProductsProps) {
  const [productsWithReviews, setProductsWithReviews] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(true);

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
                console.log(`Raw API response for product ${product.id_produk}:`, data);
                
                // Extract reviews from the correct path
                // data.reviews is array of documents, each document has a 'review' array
                let reviews = [];
                if (data.reviews && data.reviews.length > 0 && data.reviews[0].review) {
                  reviews = data.reviews[0].review;
                }
                console.log(`Extracted reviews for product ${product.id_produk}:`, reviews);
                
                let real_rating = 0;
                let real_review_count = reviews.length;
                  if (reviews.length > 0) {
                  const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
                  real_rating = totalRating / reviews.length;
                  console.log(`Product ${product.id_produk}: Calculated rating=${real_rating}, count=${real_review_count}`);
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
              console.error(`Error fetching reviews for product ${product.id_produk}:`, error);
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
        console.error('Error fetching reviews:', error);
        setProductsWithReviews(products.map(p => ({ ...p, real_rating: 0, real_review_count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [products]);
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1 h-8 bg-red-500 rounded"></div>
            <span className="text-red-500 font-medium">{subtitle}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <Link 
          href="/product/bestseller" 
          className="bg-red-500 hover:bg-red-600 active:bg-red-600 text-white px-6 py-2 rounded transition-colors"
        >
          View All
        </Link>      </div>      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>      ) : productsWithReviews && productsWithReviews.length > 0 ? (        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsWithReviews?.map((product) => (
          <Link href={`/product/${product.id_produk}`} key={product.id_produk} className="group cursor-pointer">
            <div>
              {/* Product Image Container */}
              <div className="relative bg-gray-100 rounded-lg mb-4 h-64 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.nama_produk}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to wishlist logic here
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // View logic here (can also redirect)
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4">
                  <button 
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{product.nama_produk}</h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-medium">${product.harga}</span>
                  <span className="text-gray-400 text-sm">({product.total_quantity ?? 0} terjual)</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <StarRating rating={product.real_rating ?? 0} />
                  <span className="text-gray-600 text-sm font-medium">{(product.real_rating ?? 0).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({product.real_review_count ?? 0})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No best selling products available at the moment.</p>
        </div>
      )}   
    </div>
  );
}
