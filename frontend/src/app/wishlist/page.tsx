'use client';

import { ShoppingCart, Trash2, Eye } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation';
import StarRating from "@/components/StarRating";
import RequireAuth from "@/components/RequireAuth";
import React, { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/imageUtils";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [errorWishlist, setErrorWishlist] = useState<string | null>(null);
  const [lastView, setLastView] = useState<Product[]>([]);
  const [loadingLastView, setLoadingLastView] = useState(true);
  const [errorLastView, setErrorLastView] = useState<string | null>(null);

  // Function to handle product image click
  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    // ambil user id
    const userStr = sessionStorage.getItem('user');
    let id_user = '';
    let token = sessionStorage.getItem('jwtToken') || '';
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        id_user = userObj.id || userObj.id_user || '';
      } catch (e) {
        id_user = '';
      }
    }

    // Fetch wishlist
    if (!token) {
      setErrorWishlist('Token tidak ditemukan.');
      setLoadingWishlist(false);
    } else {
      fetch('http://localhost:8080/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(async data => {
          // Jika wishlist berupa array id, fetch detail produk per id
          if (Array.isArray(data.wishlist?.produk) && typeof data.wishlist.produk[0] === 'string') {
            const products = await Promise.all(
              data.wishlist.produk.map(async (id: string) => {
                try {
                  const res = await fetch(`http://localhost:8080/api/products/${id}`);
                  if (!res.ok) throw new Error('Gagal fetch produk');
                  const p = await res.json();                  return {
                    id: p.id_produk || p.id,
                    name: p.nama_produk || p.name,
                    price: p.harga || p.price,
                    image: formatImageUrl(p.image),
                    rating: p.avg_rating ? parseFloat(p.avg_rating) : (p.rating ? parseFloat(p.rating) : 0),
                    reviews: p.total_review || p.reviews || 0,
                  };
                } catch {
                  return { id, name: `Product ${id}`, price: 0, image: '/shopit.svg', rating: 0, reviews: 0 };
                }              })
            );
            setWishlist(products);
          } else if (Array.isArray(data.wishlist?.produk)) {
            // Jika sudah objek produk
            const mapped = data.wishlist.produk.map((p: any) => ({
              id: p.id_produk || p.id,
              name: p.nama_produk || p.name,
              price: p.harga || p.price,
              image: formatImageUrl(p.image),
              rating: p.avg_rating ? parseFloat(p.avg_rating) : (p.rating ? parseFloat(p.rating) : 0),
              reviews: p.total_review || p.reviews || 0,
            }));
            setWishlist(mapped);
          } else {
            setWishlist([]);
          }
          setLoadingWishlist(false);
        })
        .catch(() => {
          setErrorWishlist('Gagal mengambil wishlist');
          setLoadingWishlist(false);
        });
    }    // Fetch lastView
    if (!token) {
      setErrorLastView('Token tidak ditemukan.');
      setLoadingLastView(false);
    } else {
      fetch(`http://localhost:8080/api/lastview`, {
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'GET'
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(async (data) => {
          console.log('Last view response:', data);          
          // Backend mengembalikan { rows } dengan detail produk
          if (data.rows && Array.isArray(data.rows)) {
            // Fetch reviews from MongoDB for each product
            const productsWithReviews = await Promise.all(
              data.rows.map(async (p: any) => {
                let real_rating = 0;
                let real_review_count = 0;
                
                try {
                  const reviewRes = await fetch(`http://localhost:8080/api/reviews/${p.id_produk || p.id}`);
                  if (reviewRes.ok) {
                    const reviewData = await reviewRes.json();
                    console.log(`Last view reviews for ${p.id_produk}:`, reviewData);
                    
                    // Extract reviews from the correct path
                    let reviews = [];
                    if (reviewData.reviews && reviewData.reviews.length > 0 && reviewData.reviews[0].review) {
                      reviews = reviewData.reviews[0].review;
                    }
                    
                    real_review_count = reviews.length;
                    if (reviews.length > 0) {
                      const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
                      real_rating = totalRating / reviews.length;
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching reviews for lastview product ${p.id_produk}:`, error);
                }
                
                return {
                  id: p.id_produk || p.id,
                  name: p.nama_produk || p.name,
                  price: p.harga || p.price,
                  image: formatImageUrl(p.image),
                  rating: real_rating,
                  reviews: real_review_count,
                };
              })
            );
            
            setLastView(productsWithReviews);
          } else {
            setLastView([]);
          }
          setLoadingLastView(false);
        })
        .catch((error) => {
          console.error('Error fetching last view:', error);
          setErrorLastView("Gagal mengambil last view");
          setLoadingLastView(false);
        });
    }
  }, []);
  return (
    <RequireAuth>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Wishlist Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">Wishlist ({wishlist.length})</h2>
          <button className="border px-4 py-2.5 rounded hover:bg-gray-100 active:bg-gray-100 text-sm sm:text-base touch-manipulation">
            Move All To Bag
          </button>
        </div>
        {/* Wishlist Grid */}
        {loadingWishlist ? (
          <div className="text-center py-7">Loading wishlist...</div>
        ) : errorWishlist ? (
          <div className="text-center text-red-500 py-8">{errorWishlist}</div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img src="https://res.cloudinary.com/dlwxkdjek/image/upload/v1750433799/capybara-turu_ledsfn.jpg" alt="Kosong" className="w-48 h-48 object-contain mb-6" />
            <div className="text-lg text-gray-700 font-medium mb-2">Wishlist mu masih kosong</div>
            <div className="text-gray-500">Ayo Jelajahi dan penuhi wishlist mu</div>
          </div>        ) : (          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {wishlist.map((product: Product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                {/* Product Image Container */}
                <div className="relative bg-gray-100 rounded-lg mb-4 h-48 sm:h-64 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || '/shopit.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/shopit.svg';
                    }}
                  />

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                    <button 
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Remove from wishlist logic here
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Mobile: Always visible Trash Icon */}
                  <button 
                    className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-black active:bg-gray-200 transition-colors z-10 sm:hidden touch-manipulation"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Remove from wishlist logic here
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Add to Cart Button */}
                  <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4 hidden sm:block">
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
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-medium">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Rating */}
                  {product.rating !== undefined && product.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.rating} />
                      <span className="text-gray-600 text-sm font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({product.reviews || 0})</span>
                    </div>
                  )}

                  {/* Mobile: Always visible Add to Cart */}
                  <div className="block sm:hidden">
                    <button 
                      className="w-full bg-black text-white py-2.5 rounded hover:bg-gray-800 active:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart logic here
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">Add To Cart</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      {/* Last View Section */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="w-1 h-5 sm:h-6 bg-red-500 rounded"></div>
        <h3 className="text-base sm:text-lg font-semibold">Last View</h3>
      </div>
      {/* Last View Grid */}
      {loadingLastView ? (
        <div className="text-center py-8">Loading last view...</div>
      ) : errorLastView || lastView.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <img src="https://res.cloudinary.com/dlwxkdjek/image/upload/v1750433799/capybara-turu_ledsfn.jpg" alt="Kosong" className="w-48 h-48 object-contain mb-6" />          <div className="text-lg text-gray-700 font-medium mb-2">Last View mu masih kosong</div>
          <div className="text-gray-500">Ayo cek produk dan temukan favoritmu!</div>
          {errorLastView && (
            <div className="text-red-500 mt-4">{errorLastView}</div>
          )}
        </div>      ) : (        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {lastView.map((product: Product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group">
              {/* Product Image Container */}
              <div className="relative bg-gray-100 rounded-lg mb-4 h-48 sm:h-64 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || '/shopit.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/shopit.svg';
                  }}
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
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

                {/* Mobile: Always visible Eye Icon */}
                <button 
                  className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-black active:bg-gray-200 transition-colors z-10 sm:hidden touch-manipulation"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // View logic here (can also redirect)
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4 hidden sm:block">
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
                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-medium">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating || 0} />
                  <span className="text-gray-600 text-sm font-medium">{(product.rating || 0).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({product.reviews || 0})</span>
                </div>

                {/* Mobile: Always visible Add to Cart */}
                <div className="block sm:hidden">
                  <button 
                    className="w-full bg-black text-white py-2.5 rounded hover:bg-gray-800 active:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add To Cart</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </RequireAuth>
  );
}