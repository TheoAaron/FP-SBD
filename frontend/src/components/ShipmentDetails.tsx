// components/ShipmentDetails.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiPlus, FiCheck, FiEdit3 } from 'react-icons/fi';

interface ShipmentDetail {
  id: string;
  firstName: string;
  lastName?: string;
  street: string;
  apartment?: string;
  city: string;
  phone: string;
  email: string;
  isDefault: boolean;
  label?: string; // "Home", "Office", etc.
}

// Mock data - ini nanti diganti dengan API call ke database
const mockShipmentDetails: ShipmentDetail[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    street: 'Jl. Sudirman No. 123',
    apartment: 'Apt 4B',
    city: 'Jakarta',
    phone: '+62 812 3456 7890',
    email: 'john.doe@example.com',
    isDefault: true,
    label: 'Home'
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    street: 'Jl. Thamrin No. 456',
    city: 'Jakarta',
    phone: '+62 812 3456 7890',
    email: 'john.doe@example.com',
    isDefault: false,
    label: 'Office'
  }
];

const ShipmentDetails = () => {
  const [savedAddresses, setSavedAddresses] = useState<ShipmentDetail[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
    label: '',
    saveInfo: false
  });

  // Simulate loading saved addresses from database
  useEffect(() => {
    const loadSavedAddresses = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: Load user's saved addresses
      const userId = 'current-user-id'; // Get from auth context
      setSavedAddresses(mockShipmentDetails);
      
      // Auto-select default address if exists
      const defaultAddress = mockShipmentDetails.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
      
      setIsLoading(false);
    };

    loadSavedAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAddress: ShipmentDetail = {
      id: Date.now().toString(),
      firstName: form.firstName,
      lastName: form.lastName,
      street: form.street,
      apartment: form.apartment,
      city: form.city,
      phone: form.phone,
      email: form.email,
      isDefault: savedAddresses.length === 0, // First address becomes default
      label: form.label || 'New Address'
    };

    if (form.saveInfo) {
      setSavedAddresses(prev => [...prev, newAddress]);
    }
    
    setSelectedAddressId(newAddress.id);
    setShowForm(false);
    
    // Reset form
    setForm({
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      phone: '',
      email: '',
      label: '',
      saveInfo: false
    });
  };

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

  if (isLoading) {
    return (
      <div className="w-full max-w-md px-4 sm:px-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Shipment Details</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 sm:px-10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">Shipment Details</h2>
      
      {/* Saved Addresses Selection */}
      {savedAddresses.length > 0 && !showForm && (
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700">Choose Address:</h3>
          
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Selection indicator */}
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAddressId === address.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAddressId === address.id && (
                  <FiCheck className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Address info */}
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </span>
                  {address.label && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {address.label}
                    </span>
                  )}
                  {address.isDefault && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {address.street}
                      {address.apartment && `, ${address.apartment}`}
                      <br />
                      {address.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 flex-shrink-0" />
                    <span>{address.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    <span>{address.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Address Button */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700"
          >
            <FiPlus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {(showForm || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmitNewAddress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name*"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="Street Address*"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <input
            name="apartment"
            value={form.apartment}
            onChange={handleChange}
            placeholder="Apartment, floor, etc. (optional)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Town/City*"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Label (Home, Office)"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number*"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address*"
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="saveInfo"
              checked={form.saveInfo}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">
              Save this information for faster check-out next time
            </span>
          </label>
          
          <div className="flex gap-3 pt-4">
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {savedAddresses.length === 0 ? 'Continue' : 'Add Address'}
            </button>
          </div>
        </form>
      )}

      {/* Selected Address Summary */}
      {selectedAddress && !showForm && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Selected Address:</h4>
          <p className="text-sm text-green-700">
            {selectedAddress.firstName} {selectedAddress.lastName}<br />
            {selectedAddress.street}{selectedAddress.apartment && `, ${selectedAddress.apartment}`}<br />
            {selectedAddress.city}<br />
            {selectedAddress.phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetails;
