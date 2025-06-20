// src/components/CouponCard.tsx
'use client'

import { Coupon } from '@/types/coupon'

interface CouponCardProps {
  coupon: Coupon
  onEdit?: () => void
  onDelete?: () => void
}

export default function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  const isExpired = new Date(coupon.expired_at) < new Date()
  const statusColor = coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{coupon.kode_kupon}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {coupon.status === 'active' ? 'Aktif' : 'Kadaluwarsa'}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{coupon.diskon}%</div>
          <div className="text-sm text-gray-500">Diskon</div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Berlaku hingga:</span>
          <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
            {new Date(coupon.expired_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Dibuat:</span>
          <span className="text-gray-900">
            {new Date(coupon.createdAt || '').toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  )
}
