import DetailProduct from "@/components/DetailProduct";
import { dummyProducts } from '@/lib/dummyProducts';
import UserReview from '@/components/userReview';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';


export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id_produk = parseInt(resolvedParams.id, 10);
  // Find current product
  const current = dummyProducts.find(p => p.id_produk === id_produk);
  if (!current) return <div>Product not found</div>;
  // Filter related products by same category
  const related = dummyProducts.filter(p => p.category === current.category && p.id_produk !== id_produk);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <DetailProduct id_produk={id_produk} />
      {/* User reviews section */}
      <div className="mt-8">
        <UserReview />
      </div>
      {/* Related products */}
      <div className="mt-12">
        <div className="inline-flex justify-start items-center gap-4">
    <div className="w-5 h-10 relative">
        <div className="w-5 h-10 left-0 top-0 absolute bg-red-500 rounded" />
    </div>
    <div className="justify-start text-red-500 text-base font-semibold font-['Poppins'] leading-tight">Related Item</div>
</div>

        {/* Carousel for related products */}
        <div className="mt-6">
          <RelatedProductsCarousel products={related} />
        </div>
      </div>
    </main>
  );
}
