import DetailProduct, { ProductDetailProps } from "@/components/DetailProduct";
import { dummyProducts } from '@/lib/dummyProducts';
import UserReview from '@/components/userReview';
import StarRating from '@/components/StarRating'; // Assuming you have a StarRating component


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const id_produk = parseInt(params.id, 10);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-6">
          {related.map(prod => (
            <div key={prod.id_produk} className="group border rounded-lg p-4 hover:shadow-md transition">
              <div className="relative bg-gray-100 rounded-md flex items-center justify-center h-40 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.nama_produk}
                  className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-lg text-gray-800">{prod.nama_produk}</h4>
                <p className="justify-start text-red-500 text-base font-small font-['Poppins'] leading-normal">${prod.harga.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={prod.avg_rating} />
                  <span className="text-gray-600 text-sm">({prod.total_review})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
