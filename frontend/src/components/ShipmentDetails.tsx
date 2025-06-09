// components/ShipmentDetails.tsx
'use client';
import React, { useState } from 'react';

const ShipmentDetails = () => {
  const [form, setForm] = useState({
    firstName: '',
    street: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
    saveInfo: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="w-full max-w-md px-10">
      <h2 className="text-2xl font-semibold mb-6">Shipment Details</h2>
      <form className="space-y-4">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full border p-2 rounded" required />
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address" className="w-full border p-2 rounded" required />
        <input name="apartment" value={form.apartment} onChange={handleChange} placeholder="Apartment, floor, etc. (optional)" className="w-full border p-2 rounded" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="Town/City" className="w-full border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2 rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full border p-2 rounded" required />
        <label className="flex items-center">
          <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} className="mr-2" />
          Save this information for faster check-out next time
        </label>
      </form>
    </div>
  );
};

export default ShipmentDetails;
