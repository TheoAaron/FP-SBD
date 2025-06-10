// src/app/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'

export interface Product {
  id: string
  name: string
  image: string
  price: number
  oldPrice?: number
  stock: number
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gucci duffle bag',
    image: '/images/gucci-bag.jpg',
    price: 960,
    oldPrice: 1160,
    stock: 15
  },
  {
    id: '2',
    name: 'RGB liquid CPU Cooler',
    image: '/images/cooler.jpg',
    price: 1960,
    stock: 8
  },
  // ... tambahkan produk lainnya
]


export default function Admin() {
   const [search, setSearch] = useState('')

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <>
     <AdminHeader />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Link 
            href="/admin/products/new"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Add New Product
          </Link>
        </div>

        <div className="mb-6 max-w-xs">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <ProductGrid products={filteredProducts} />
      </main>

      <AdminFooter />
    </>
  )
}

// Komponen Tambahan
function AdminHeader() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between h-20 px-8">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-black">tok</span>
          <span className="text-red-500">ET</span>
          <span className="text-xs align-super ml-1">erion</span>
        </Link>
        <nav className="flex items-center gap-8 text-gray-700">
          {/* Navigation items */}
        </nav>
      </div>
    </header>
  )
}

function AdminFooter() {
  return (
    <footer className="w-full border-t mt-12 py-6 text-center text-gray-500 text-sm bg-white">
      © Copyright SBD Kelompok 1 2025
    </footer>
  )
}

function SearchBar({ value, onChange }: { 
  value: string
  onChange: (value: string) => void 
}) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full border rounded-l-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-200"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button className="border border-l-0 rounded-r-md px-3 py-2 bg-gray-50 hover:bg-gray-100">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onEdit={() => console.log('Edit', product.id)}
          onDelete={() => console.log('Delete', product.id)}
        />
      ))}
    </div>
  )
}
