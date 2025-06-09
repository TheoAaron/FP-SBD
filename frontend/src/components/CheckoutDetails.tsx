// components/CheckoutDetails.tsx
'use client';
import React from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Props = {
  items: CartItem[];
};

const CheckoutDetails: React.FC<Props> = ({ items }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full max-w-md space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={item.image} alt={item.name} className="w-8 h-8" />
            <span>{item.name}</span>
          </div>
          <span>${item.price}</span>
        </div>
      ))}

      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${subtotal}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="radio" name="payment" value="bank" />
          <span>Bank</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="payment" value="cod" defaultChecked />
          <span>Cash on delivery</span>
        </label>
        <div className="flex space-x-2 mt-2">
          <input type="text" placeholder="Coupon Code" className="flex-1 border p-2 rounded" />
          <button className="bg-red-500 text-white px-4 py-2 rounded">Apply Coupon</button>
        </div>
      </div>

      <button className="w-full bg-red-500 text-white py-2 rounded mt-4">Place Order</button>
    </div>
  );
};

export default CheckoutDetails;
