// src/app/admin/products/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { Product } from '@/types/product'
import { useRouter } from 'next/navigation'
import {jwtDecode} from 'jwt-decode'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const loadProduct = async () => {
  //     try {
  //       // Simulasi fetch data dari API
  //       await new Promise(resolve => setTimeout(resolve, 500))
  //       // Ganti dengan fetch dari API Anda
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/product/${productId}`)
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch product')
  //       }
  //       const productData: Product = await response.json()
        
  //       if (!productData) {
  //         throw new Error('Product not found')
  //       }
  //       setProduct(productData)
  //     } catch (error) {
  //       console.error('Error loading product:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   loadProduct()
  // }, [productId])

  const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const token = sessionStorage.getItem('jwtToken')
    useEffect(() => {
      const checkAuth = async () => {
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
          // If the user is admin, fetch the product
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/admin/product/${productId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch product')
          }
          const productData: Product = await response.json()
          
          if (!productData) {
            throw new Error('Product not found')
          }
          setProduct(productData)          
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setLoading(false)
        }
      }
  
      checkAuth()
    }, [token, router])

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Produk tidak ditemukan</p>
          <a href="/admin/product" className="text-blue-500 hover:underline">
            Kembali ke daftar produk
          </a>
        </div>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
