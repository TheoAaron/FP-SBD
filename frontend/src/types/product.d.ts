export interface Product {
  id_produk: UUID;
  nama_produk: string;
  avg_rating: number;
  harga: number;
  description: string;
  image: string;
  stock: number;
  total_review: number;
  kategori: string;
}
