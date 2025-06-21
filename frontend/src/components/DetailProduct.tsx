'use client';
import React, { useState, useEffect } from 'react';
import StarRating from '@/components/StarRating';
import { Heart } from 'lucide-react';

export type ProductDetailProps = { id_produk: string };

interface Product {
  id_produk: number;
  nama_produk: string;
  image: string;
  harga: number;
  description: string;
  avg_rating: number;
  total_review: number;
  stock: number;
  category: string;
}

export default function DetailProduct({ id_produk }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/${id_produk}`);
        
        if (!res.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await res.json();
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id_produk) {
      fetchProduct();
    }
  }, [id_produk]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || 'The product you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">        {/* Product Image */}
        <div className="w-full">
          <div className="bg-neutral-100 rounded-lg overflow-hidden aspect-square">
            <img 
              className="w-full h-full object-cover" 
              src={product.image}
              alt={product.nama_produk}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.png';
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-semibold text-black leading-tight">
            {product.nama_produk}
          </h1>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-3 text-sm">
            <StarRating rating={product.avg_rating} />
            <span className="opacity-70">({product.total_review} Reviews)</span>
            <span className="mx-1 opacity-50">|</span>
            <span className="text-green-500 font-medium">In Stock</span>
          </div>

          {/* Price */}
          <div className="text-xl sm:text-2xl font-normal text-black">
            ${product.harga.toFixed(2)}
          </div>

          {/* Description */}
          <div className="text-sm text-black leading-relaxed opacity-90 max-w-md">
            {product.description}
          </div>

          {/* Divider */}
          <div className="border-t border-black/20 my-4 sm:my-6"></div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              {/* Quantity Selector */}
              <div className="flex items-center border border-black/50 rounded overflow-hidden h-11 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-11 flex items-center justify-center border-r border-black/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                >
                  <span className="text-xl font-medium text-black">-</span>
                </button>

                <div className="w-20 h-11 flex items-center justify-center">
                  <span className="text-xl font-medium text-black">{quantity}</span>
                </div>

                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-11 flex items-center justify-center bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 active:bg-red-600 touch-manipulation"
                >
                  <span className="text-xl font-medium text-white">+</span>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button className="flex-1 sm:flex-none h-11 px-8 sm:px-12 bg-red-500 hover:bg-red-600 active:bg-red-600 rounded text-white font-medium transition-colors touch-manipulation">
                Add to Cart
              </button>

              {/* Wishlist Button */}
              <button className="w-11 h-11 rounded border border-black/50 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 touch-manipulation">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border border-black/20 rounded p-4 space-y-4">
            {/* Free Delivery */}
            <div className="flex items-start gap-4">
              <img src="/icon-delivery.svg" alt="Delivery" className="w-8 h-8 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-base font-medium text-black">Free Delivery</div>
                <div className="text-xs text-black/70">Enter your postal code for Delivery Availability</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/20"></div>

            {/* Return Delivery */}
            <div className="flex items-start gap-4">
              <img src="/Icon-return.png" alt="Return" className="w-8 h-8 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-base font-medium text-black">Return Delivery</div>
                <div className="text-xs text-black/70">
                  Free 30 Days Delivery Returns.{' '}
                  <span className="underline cursor-pointer">Details</span>
                </div>
              </div>
            </div>
          </div>        </div>
      </div>
    </div>
  );
}
