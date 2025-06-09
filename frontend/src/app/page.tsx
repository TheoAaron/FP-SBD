// src/app/page.tsx

import BestSellingProducts from '../components/BestSellingProduct.tsx';
import DiscoveryProduct from '../components/DiscoveryProduct.tsx'

export default function Home() {
  return (
    <div>
      <BestSellingProducts />
      <DiscoveryProduct />
    </div>
  );
}