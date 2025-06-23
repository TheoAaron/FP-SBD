'use client'
import CouponForm from '../../../components/CouponForm'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function AddCouponPage() {

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        router.push('/login')
        return
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-blue-500">Error: {error}</div>
      </div>
    )
  }

  return <CouponForm mode="create" />
}
