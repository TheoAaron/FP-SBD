// components/CheckoutDetails.tsx
'use client';
import React, { useState } from 'react';

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type Props = {
  items: CheckoutItem[];
  onPlaceOrder?: (paymentMethod: string, couponCode?: string) => void;
  isLoading?: boolean;
};

const CheckoutDetails: React.FC<Props> = ({ items, onPlaceOrder, isLoading = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const discount = couponDiscount;
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = () => {
    if (onPlaceOrder) {
      onPlaceOrder(paymentMethod, couponCode || undefined);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Credit Card</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Bank Transfer</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Cash on Delivery</span>
          </label>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Coupon Code</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
          <button 
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Order Total */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount:</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <hr className="my-2" />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span className="text-red-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || items.length === 0}
        className={`w-full mt-6 px-6 py-3 rounded-md font-medium transition-colors ${
          isLoading || items.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Place Order - $${total.toFixed(2)}`
        )}
      </button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment information is secure and encrypted
      </p>
    </div>
  );
};

export default CheckoutDetails;
