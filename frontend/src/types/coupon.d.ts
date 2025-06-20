export interface Coupon {
  id_kupon?: string;
  kode_kupon: string;
  expired_at: string;
  status: 'active' | 'expired';
  diskon: number;
  createdAt?: string;
  updatedAt?: string;
}
