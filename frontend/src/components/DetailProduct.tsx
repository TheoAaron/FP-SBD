import React, { useEffect, useState } from 'react';

type Product = {
  id_produk: number;
  id_kategori: number;
  nama_produk: string;
  avg_rating: number;
  harga: number;
  description: string;
  image: string;
  stock: number;
  total_review: number;
};

type ProductDetailProps = {
  id_produk: number;
};

export default function ProductDetail({ id_produk }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id_produk}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id_produk]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="w-[1134px] h-[605px] relative">
      <div className="w-[628px] h-[605px] left-0 top-0 absolute bg-neutral-100 rounded overflow-hidden">
        <img className="w-96 h-80 left-[91px] top-[145px] absolute" src={product.image} alt={product.nama_produk} />
      </div>
      <div className="left-[734px] top-[60px] absolute text-black text-2xl font-semibold font-['Inter'] leading-normal tracking-wide">{product.nama_produk}</div>
      <div className="left-[734px] top-[137px] absolute text-black text-2xl font-normal font-['Inter'] leading-normal tracking-wide">${product.harga.toFixed(2)}</div>
      <div className="w-72 h-5 left-[734px] top-[100px] absolute inline-flex justify-start items-start gap-4">
        <div className="flex justify-start items-start gap-2">
          <div className="flex justify-start items-start">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-sm ${i < Math.floor(product.avg_rating) ? 'bg-amber-400' : 'opacity-25 bg-black'}`}
              />
            ))}
          </div>
          <div className="opacity-50 text-black text-sm font-normal font-['Poppins'] leading-tight">({product.total_review} Reviews)</div>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="w-4 h-0 origin-top-left rotate-90 opacity-50 outline outline-1 outline-offset-[-0.50px] outline-black"></div>
          <div className={`text-sm font-normal font-['Poppins'] leading-tight ${product.stock > 0 ? 'text-green-500 opacity-60' : 'text-red-500 opacity-60'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      </div>
      <div className="w-96 left-[734px] top-[185px] absolute text-black text-sm font-normal font-['Poppins'] leading-tight">{product.description}</div>
      
      {/* You can add quantity controls and Buy Now button like your example */}
      {/* ... */}
    </div>
  );
}
