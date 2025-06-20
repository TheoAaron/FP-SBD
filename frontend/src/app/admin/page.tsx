'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../types/product'
import {jwtDecode} from 'jwt-decode'


export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()


  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = sessionStorage.getItem('jwtToken')

      if (!token) {
        router.push('/login')
        return
      }

      try {
        const decodedToken = jwtDecode<{ role: string }>(token)
        if (decodedToken.role !== 'admin') {
          router.push('/login')
          return
        }

        // If the user is admin, fetch the products
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/product`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])  


  const filteredProducts = products.filter(product =>
    product.nama_produk.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,        
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete product')
          }
          setProducts(products.filter(product => product.id_produk !== id))
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'An error occurred while deleting the product')
        })
    }
  }
  const handleAddProduct = () => {
    router.push('/admin/add/')
  }
  const handleAddCoupon = () => {
    router.push('/admin/coupon/')
  }

  const handleViewCoupons = () => {
    router.push('/admin/coupon/list/')
  }

  
  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading...</div>
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>
  }
  }else{
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-8">        {/* Header */}        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">All Produk</h1>
          <div className="flex gap-3">
            <button
              onClick={handleViewCoupons}
              className="border border-green-300 px-6 py-2 rounded-md text-green-700 hover:bg-green-50 transition-colors font-medium"
            >
              Lihat Kupon
            </button>
            <button
              onClick={handleAddCoupon}
              className="border border-blue-300 px-6 py-2 rounded-md text-blue-700 hover:bg-blue-50 transition-colors font-medium"
            >
              Add New Coupon
            </button>
            <button
              onClick={handleAddProduct}
              className="border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Add New Product
            </button>
          </div>
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
        {/* jika product kosong */}
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mb-8">
            <p className="text-lg">No products found</p>
            <p className="text-sm">Add a new product.</p>
          </div>
        )}


        {/* jika ada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id_produk}
                product={product}
                onEdit={() => handleEdit(product.id_produk)}
                onDelete={() => handleDelete(product.id_produk)}
              />
            ))}
          </div>
      </main>

      {/* Footer
      <footer className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm">© Copyright SBD Kelompok 1 anjay 2025</p>
        </div>
      </footer> */}
    </div>
  )
}
}