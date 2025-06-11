// src/components/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id?: string
  name: string
  description: string
  image: string
  price: number
  oldPrice?: number
  stock: number
}

interface ProductFormProps {
  product?: Product
  mode: 'create' | 'edit'
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    image: product?.image || '',
    price: product?.price?.toString() || '',
    oldPrice: product?.oldPrice?.toString() || '',
    stock: product?.stock?.toString() || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Update form ketika product berubah (untuk edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || '',
        stock: product.stock.toString()
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
        const productData = {
        ...(mode === 'edit' && product?.id && { id: product.id }),
        name: formData.name,
        description: formData.description,
        image: formData.image,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
        stock: parseInt(formData.stock)
      }

      console.log(`${mode === 'create' ? 'Created' : 'Updated'} product:`, productData)
      alert(`Produk berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}!`)
      router.push('/admin/products')
    } catch (error) {
      alert(`Terjadi kesalahan saat ${mode === 'create' ? 'menambahkan' : 'memperbarui'} produk`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCreateMode = mode === 'create'
  const title = isCreateMode ? 'Tambah Produk Baru' : 'Edit Produk'
  const submitText = isCreateMode ? 'Simpan Produk' : 'Perbarui Produk'
  const submittingText = isCreateMode ? 'Menyimpan...' : 'Memperbarui...'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-8">{title}</h1>
          
          <form onSubmit={handleSubmit}>            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan deskripsi produk"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-20 h-20 object-contain border rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>            <div className={`${mode === 'edit' ? 'grid grid-cols-2 gap-4' : ''} mb-6`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Lama (Opsional)
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? submittingText : submitText}
              </button>
              <Link
                href="/admin/products"
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors inline-block text-center"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
