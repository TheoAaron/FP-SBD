'use client';

import { ShoppingCart, Trash2, Eye } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import StarRating from "@/components/StarRating";
import React, { useEffect, useState } from "react";

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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [errorWishlist, setErrorWishlist] = useState<string | null>(null);
  const [lastView, setLastView] = useState<Product[]>([]);
  const [loadingLastView, setLoadingLastView] = useState(true);
  const [errorLastView, setErrorLastView] = useState<string | null>(null);

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
                  const p = await res.json();
                  return {
                    id: p.id_produk || p.id,
                    name: p.nama_produk || p.name,
                    price: p.harga || p.price,
                    image: p.image ? `/${p.image}` : '/shopit.svg',
                    rating: p.avg_rating || p.rating || 0,
                    reviews: p.total_review || p.reviews || 0,
                  };
                } catch {
                  return { id, name: `Product ${id}`, price: 0, image: '/shopit.svg', rating: 0, reviews: 0 };
                }
              })
            );
            setWishlist(products);
          } else if (Array.isArray(data.wishlist?.produk)) {
            // Jika sudah objek produk
            const mapped = data.wishlist.produk.map((p: any) => ({
              id: p.id_produk || p.id,
              name: p.nama_produk || p.name,
              price: p.harga || p.price,
              image: p.image ? `/${p.image}` : '/shopit.svg',
              rating: p.avg_rating || p.rating || 0,
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
    }

    // Fetch lastView
    if (!token) {
      setErrorWishlist('Token tidak ditemukan.');
      setLoadingWishlist(false);
    } else {
      fetch(`http://localhost:8080/api/lastview`, {
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'GET'
      })
        .then(res => res.json())
        .then(async data => {
          // Jika lastView berupa array id, fetch detail produk per id
          if (Array.isArray(data.lastView?.produk) && typeof data.lastView.produk[0] === 'string') {
            const products = await Promise.all(
              data.lastView.produk.map(async (id: string) => {
                try {
                  const res = await fetch(`http://localhost:8080/api/products/${id}`);
                  if (!res.ok) throw new Error('Gagal fetch produk');
                  const p = await res.json();
                  return {
                    id: p.id_produk || p.id,
                    name: p.nama_produk || p.name,
                    price: p.harga || p.price,
                    image: p.image ? `/${p.image}` : '/shopit.svg',
                    rating: p.avg_rating || p.rating || 0,
                    reviews: p.total_review || p.reviews || 0,
                  };
                } catch {
                  return { id, name: `Product ${id}`, price: 0, image: '/shopit.svg', rating: 0, reviews: 0 };
                }
              })
            );
            setLastView(products);
          } else if (Array.isArray(data.lastView?.produk)) {
            // Jika sudah objek produk
            const mapped = data.lastView.produk.map((p: any) => ({
              id: p.id_produk || p.id,
              name: p.nama_produk || p.name,
              price: p.harga || p.price,
              image: p.image ? `/${p.image}` : '/shopit.svg',
              rating: p.avg_rating || p.rating || 0,
              reviews: p.total_review || p.reviews || 0,
            }));
            setLastView(mapped);
          } else {
            setLastView([]);
          }
          setLoadingLastView(false);
        })
        .catch(() => {
          setErrorLastView("Gagal mengambil lastView");
          setLoadingLastView(false);
        });
    }
  }, []);

  return (
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {wishlist.map(product => (
            <div key={product.id} className="border rounded-lg p-3 sm:p-4 group">
              <div className="relative h-40 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-3 sm:mb-4">
                <button className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black hover:bg-gray-200 transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 z-10 hidden sm:flex">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-black active:bg-gray-200 transition-colors z-10 sm:hidden touch-manipulation">
                  <Trash2 className="w-4 h-4" />
                </button>
                <img
                  src={product.image || '/shopit.svg'}
                  alt={product.name}
                  className="object-contain w-full h-full p-3 sm:p-4"
                />
                <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4 hidden sm:block">
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-red-500 font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className="block sm:hidden">
                <button className="w-full bg-black text-white py-2.5 rounded hover:bg-gray-800 active:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Add To Cart</span>
                </button>
              </div>
            </div>
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
          <img src="https://res.cloudinary.com/dlwxkdjek/image/upload/v1750433799/capybara-turu_ledsfn.jpg" alt="Kosong" className="w-48 h-48 object-contain mb-6" />
          <div className="text-lg text-gray-700 font-medium mb-2">Last View mu masih kosong</div>
          <div className="text-gray-500">Ayo cek produk dan temukan favoritmu!</div>
          {errorLastView && (
            <div className="text-red-500 mt-4">{errorLastView}</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {lastView.map(product => (
            <div key={product.id} className="border rounded-lg p-3 sm:p-4 group">
              <div className="relative h-40 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-3 sm:mb-4">
                {/* Desktop: Hover Eye Icon */}
                <button className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 items-center justify-center text-black hover:bg-gray-200 transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 z-10 hidden sm:flex">
                  <Eye className="w-5 h-5" />
                </button>
                {/* Mobile: Always visible Eye Icon */}
                <button className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 items-center justify-center text-black active:bg-gray-200 transition-colors z-10 sm:hidden touch-manipulation">
                  <Eye className="w-4 h-4" />
                </button>
                <img
                  src={product.image || '/shopit.svg'}
                  alt={product.name}
                  className="object-contain w-full h-full p-3 sm:p-4"
                />
                {/* Desktop: Hover Add to Cart */}
                <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 pb-4 hidden sm:block">
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-red-500 font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <StarRating rating={product.rating} />
                  <span className="text-gray-600 text-sm font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({product.reviews})</span>
                </div>
              )}
              {/* Mobile: Always visible Add to Cart */}
              <div className="block sm:hidden">
                <button className="w-full bg-black text-white py-2.5 rounded hover:bg-gray-800 active:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-manipulation">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Add To Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}