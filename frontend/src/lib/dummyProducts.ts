// filepath: src/lib/dummyProducts.ts
export interface Product {
  id_produk: number;
  id_kategori: number;
  category: string;
  nama_produk: string;
  avg_rating: number; // e.g., 4.5
  harga: number;      // price in float
  description: string;
  image: string;      // URL string
  stock: number;      // available stock
  total_review: number;
}

export const dummyProducts: Product[] = [
  {
    id_produk: 1,
    id_kategori: 101,
    category: 'Widgets',
    nama_produk: 'Super Widget',
    avg_rating: 4.3,
    harga: 199.99,
    description: 'High quality super widget for everyday use.',
    image: 'https://placehold.co/600x400',
    stock: 34,
    total_review: 124,
  },
  {
    id_produk: 2,
    id_kategori: 102,
    category: 'Widgets',
    nama_produk: 'Mega Gadget',
    avg_rating: 3.8,
    harga: 249.49,
    description: 'Durable mega gadget that solves all problems.',
    image: 'https://placehold.co/600x400',
    stock: 12,
    total_review: 89,
  },
  {
    id_produk: 3,
    id_kategori: 103,
    category: 'Widgets',
    nama_produk: 'Ultra Device',
    avg_rating: 2,
    harga: 349.0,
    description: 'The ultimate device for tech enthusiasts.',
    image: 'https://placehold.co/600x400',
    stock: 5,
    total_review: 230,
  },
];
