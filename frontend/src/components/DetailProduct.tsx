'use client';
import React, { useState } from 'react';
import { dummyProducts } from '@/lib/dummyProducts';
import StarRating from '@/components/StarRating';
import { Heart, HeartIcon } from 'lucide-react';


<HeartIcon className="w-5 h-5 text-gray-700" />



export type ProductDetailProps = { id_produk: number };

export default function DetailProduct({ id_produk }: ProductDetailProps) {
  const product = dummyProducts.find(p => p.id_produk === id_produk);
  if (!product) return <div>Product not found</div>;
  const [quantity, setQuantity] = useState(1);

  return (
   <div className="w-[1134px] h-[605px] relative">
    <div className="w-[628px] h-[605px] left-0 top-0 absolute bg-neutral-100 rounded overflow-hidden">
        <img className="w-96 h-80 left-[91px] top-[145px] absolute" src={product.image} />
    </div>
    <div className="left-[734px] top-[60px] absolute text-black text-2xl font-semibold font-['Inter'] tracking-wide">{product.nama_produk}</div>
    <div className="left-[734px] top-[137px] absolute text-black text-2xl font-normal font-['Inter'] tracking-wide">{`$${product.harga.toFixed(2)}`}</div>
    <div className="absolute left-[734px] top-[100px] flex items-center gap-2 text-sm font-['Poppins']">
      <StarRating rating={product.avg_rating} />
      <span className="opacity-50">({product.total_review} Reviews)</span>
      <span className="mx-2 opacity-50">|</span>
      <span className="text-green-500">In Stock</span>
    </div>
    <div className="w-96 left-[734px] top-[185px] absolute justify-start text-black text-sm font-normal font-['Poppins'] leading-tight">{product.description}</div>
    <div className="w-96 h-0 left-[734px] top-[272px] absolute opacity-50">
        <div className="w-96 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
    </div>
      <div className="absolute left-[734px] top-[301px] flex items-center border border-black/50 rounded overflow-hidden h-11 w-fit">
         {/* Minus Button */}
         <button
           onClick={() => setQuantity(q => Math.max(1, q - 1))}
           disabled={quantity <= 1}
           className="w-10 h-11 flex items-center justify-center border-r border-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <span className="text-xl font-medium text-black">-</span>
         </button>

         {/* Quantity Display */}
         <div className="w-20 h-11 flex items-center justify-center">
           <span className="text-xl font-medium font-['Poppins'] leading-7 text-black">{quantity}</span>
         </div>

         {/* Plus Button */}
         <button
           onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
           disabled={quantity >= product.stock}
           className="w-10 h-11 flex items-center justify-center bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
         >
           <span className="text-xl font-medium text-white">+</span>
         </button>
       </div>

    <div data-button="Small" data-hover="No" className="absolute left-[904px] top-[301px] flex items-center h-11 px-12 bg-red-500 rounded text-neutral-50 font-medium justify-center gap-2.5">
        Add to Cart
    </div>
    <div className="w-10 h-10 left-[1094px] top-[303px] absolute rounded outline outline-1 outline-black/50 overflow-hidden">
      <HeartIcon className="w-10 h-10 text-gray-700 p-2" />
    </div>
    <div className="w-96 h-44 left-[735px] top-[385px] absolute rounded outline outline-1 outline-offset-[-1px] outline-black/50 overflow-hidden">
        <div className="w-96 h-0 left-0 top-[90px] absolute opacity-50">
            <div className="w-96 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
        </div>
        <div className="left-[16px] top-[24px] absolute inline-flex justify-start items-center gap-4">
          <img src="/icon-delivery.svg" alt="" />
            <div className="inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-black text-base font-medium font-['Poppins'] leading-normal">Free Delivery</div>
            </div>
        </div>
        <div className="left-[16px] top-[106px] absolute inline-flex justify-start items-center gap-4">
           <img src="/icon-return.png" alt="" />
            <div className="inline-flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-black text-base font-medium font-['Poppins'] leading-normal">Return Delivery</div>
                <div className="justify-start"><span className="text-black text-xs font-medium font-['Poppins'] leading-none">Free 30 Days Delivery Returns. </span><span className="text-black text-xs font-medium font-['Poppins'] underline leading-none">Details</span></div>
            </div>
        </div>
    </div>
</div>
  );
}
