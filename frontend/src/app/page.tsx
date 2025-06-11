// src/app/page.ts
import Carousel from '@/components/Carousel';
import BestSellingProducts from '@/components/BestSellingProduct';
import DiscoveryProduct from '@/components/DiscoveryProduct'
import CategorySection from "@/components/Category";

const images = [
  { src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=400&fit=crop', alt: 'First Slide' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop', alt: 'Second Slide' },
  { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop', alt: 'Third Slide' },
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