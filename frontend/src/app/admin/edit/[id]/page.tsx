// src/app/admin/products/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  oldPrice?: number
  stock: number
}

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Simulasi fetch data dari API
        await new Promise(resolve => setTimeout(resolve, 500))
          // Mock data berdasarkan ID
        const mockData: Record<string, Product> = {
          '1': {
            id: '1',
            name: 'Gucci duffle bag',
            description: 'Luxury duffle bag made from premium materials with elegant design perfect for travel.',
            image: '/images/gucci-bag.jpg',
            price: 960,
            oldPrice: 1160,
            stock: 15
          },
          '2': {
            id: '2',
            name: 'RGB liquid CPU Cooler',
            description: 'High-performance liquid cooling system with RGB lighting for gaming PCs.',
            image: '/images/cooler.jpg',
            price: 1960,
            stock: 8
          },
          '3': {
            id: '3',
            name: 'GP11 Shooter USB Gamepad',
            description: 'Professional gaming controller with precision controls and ergonomic design.',
            image: '/images/gamepad.jpg',
            price: 550,
            stock: 12
          },
          '4': {
            id: '4',
            name: 'Quilted Satin Jacket',
            description: 'Stylish quilted satin jacket perfect for casual and semi-formal occasions.',
            image: '/images/jacket.jpg',
            price: 750,
            stock: 6
          }
        }

        const productData = mockData[productId] || {
          id: productId,
          name: 'Sample Product',
          description: 'Sample product description for testing purposes.',
          image: '/images/sample.jpg',
          price: 100,
          stock: 10
        }

        setProduct(productData)
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

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
          <a href="/admin/products" className="text-blue-500 hover:underline">
            Kembali ke daftar produk
          </a>
        </div>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
