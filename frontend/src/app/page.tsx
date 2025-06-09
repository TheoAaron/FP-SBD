// src/app/page.ts
import Carousel from '@/components/Carousel';
import BestSellingProducts from '@/components/BestSellingProduct';
import DiscoveryProduct from '@/components/DiscoveryProduct'
import CategorySection from "@/components/Category";

const images = [
  { src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop', alt: 'First Slide' },
  { src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', alt: 'Second Slide' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop', alt: 'Third Slide' },
];



export default function Home() {
  return (    
    <div>
      <Carousel images={images} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <CategorySection />
      </div>
      <BestSellingProducts />
      <DiscoveryProduct />
    </div>
  );
}