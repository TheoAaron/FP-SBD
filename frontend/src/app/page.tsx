// src/app/page.ts
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
  const res = await fetch(`http://localhost:8080/api/products`, {
    cache: 'no-store' // ensures fresh data every request; remove if you want static
  });
  const products: Product[] = await res.json();
  console.log(products);
  return (    
    <div>
      <Carousel images={images} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <CategorySection />
      </div>
      <BestSellingProducts products={products}/>
      <DiscoveryProduct products={products}/>
    </div>
  );
}