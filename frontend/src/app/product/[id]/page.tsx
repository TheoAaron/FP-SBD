import DetailProduct from "@/components/DetailProduct";
import UserReview from '@/components/userReview';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';


export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id_produk = resolvedParams.id;
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products/${id_produk}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return <div>Product not found</div>;
  }
  
  const current = await res.json();
  
  const allProductsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/products`, {
    cache: 'no-store'
  });
  
  let related = [];
  if (allProductsRes.ok) {
    const allProducts = await allProductsRes.json();
    // Filter related products by same category
    related = allProducts.filter((p: any) => p.category === current.category && p.id_produk !== id_produk);
  }  return (
    <main className="max-w-7xl mx-auto p-6">      <DetailProduct id_produk={id_produk} />
      {/* User reviews section */}
      <div className="mt-8">
        <UserReview id_produk={id_produk} />
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
