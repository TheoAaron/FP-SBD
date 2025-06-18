// src/app/admin/products/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../types/product'



export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) throw new Error('Unauthorized')
      const user = await res.json()
      if (user.role !== 'admin') {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/products')
      if (!res.ok) throw new Error('Gagal memuat produk')
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Gagal memuat data produk')
    } finally {
      setLoading(false)
    }
  }

  checkAuth().then(fetchProducts)
}, [router])


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  // Fungsi Edit Product
  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`)
  }

  // Fungsi Delete Product
  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id)
    if (confirm(`Apakah Anda yakin ingin menghapus "${product?.name}"?`)) {
      setProducts(products.filter(product => product.id !== id))
      alert('Produk berhasil dihapus!')
    }
  }

  // Fungsi Add Product
  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All produk</h1>
          <button 
            onClick={handleAddProduct}
            className="border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product.id)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm">© Copyright SBD Kelompok 1 anjay 2025</p>
        </div>
      </footer>
    </div>
  )
}
