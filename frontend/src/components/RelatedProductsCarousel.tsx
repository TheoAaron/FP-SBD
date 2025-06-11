'use client';
import React, { useRef } from 'react';
import StarRating from '@/components/StarRating';
import { Product } from '@/lib/dummyProducts';

interface CarouselProps {
  products: Product[];
}

export default function RelatedProductsCarousel({ products }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    }
  };

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
        {products.map(prod => (
          <div
            key={prod.id_produk}
            className="min-w-[200px] flex-shrink-0 group border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-40 overflow-hidden">
              <img
                src={prod.image}
                alt={prod.nama_produk}
                className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="mt-2 font-medium text-lg text-gray-800">{prod.nama_produk}</h4>
            <p className="text-red-500 font-semibold mt-1">${prod.harga.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={prod.avg_rating} />
              <span className="text-gray-600 text-sm">({prod.total_review})</span>
            </div>
          </div>
        ))}
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
