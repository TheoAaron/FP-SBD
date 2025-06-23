'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { Product } from '@/types/product'
import { jwtDecode } from 'jwt-decode'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwtToken')
    setToken(jwt)

    const checkAuthAndFetch = async () => {
      if (!jwt) {
        router.push('/login')
        return
      }

      try {
        const decodedToken = jwtDecode<{ role: string }>(jwt)
        if (decodedToken.role !== 'admin') {
          router.push('/login')
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/product/${productId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const productData: Product = await response.json()
        setProduct(productData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [productId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-600 mb-4">{error || 'Produk tidak ditemukan'}</p>
          <a href="/admin/products" className="text-blue-500 hover:underline">
            Kembali ke daftar produk
          </a>
        </div>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" token={token || ''} />
}
