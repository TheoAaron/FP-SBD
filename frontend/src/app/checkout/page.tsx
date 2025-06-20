'use client';
import ShipmentDetails from '../../components/ShipmentDetails';
import CheckoutDetails from '../../components/CheckoutDetails';

export default function Checkout() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 ">
      <ShipmentDetails />
      <CheckoutDetails items={[
        { id: 1, name: 'Product 1', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop' },
        { id: 2, name: 'Product 1', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop' },
      ]} />        
    </div>
  );
}
