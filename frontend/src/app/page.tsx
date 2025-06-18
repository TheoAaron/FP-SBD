// src/app/page.ts
import { Suspense } from 'react';
import Carousel from '@/components/Carousel';
import BestSellingProducts from '@/components/BestSellingProduct';
import DiscoveryProduct from '@/components/DiscoveryProduct'
import CategorySection from "@/components/Category";
import { Product } from '@/types/product';

const images = [
  { src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=400&fit=crop', alt: 'First Slide' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop', alt: 'Second Slide' },
  { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop', alt: 'Third Slide' },
];



export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products`, {
    cache: 'no-store' // ensures fresh data every request; remove if you want static
  });
  const products: Product[] = await res.json();
  console.log(products);
  return (    
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="w-full">
        <Carousel images={images} />
      </div>
      
      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        }>
          <CategorySection />
        </Suspense>
      </div>
      
      {/* Best Selling Products */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <BestSellingProducts />
      </div>
      
      {/* Discovery Products */}
      <div className="py-8 sm:py-12">
        {/* <DiscoveryProduct product/> */}
      </div>
      <BestSellingProducts products={products}/>
      <DiscoveryProduct products={products}/>
    </div>
  );
}