'use client'
import ProductForm from '../../../components/ProductForm'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '../../../components/ProductCard'
import { Product } from '../../../types/product'
import {jwtDecode} from 'jwt-decode'

export default function AddProductPage() {
  // cek autentikasi
  // jika tidak ada token, redirect ke halaman login
  // jika ada token, cek role
  // jika role bukan admin, redirect ke halaman login
  // jika role admin, tampilkan halaman tambah produk
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token, router])

  return <ProductForm mode="create" />
}
