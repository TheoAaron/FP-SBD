
export interface Product {
  id_produk: number;
  id_kategori: number;
  category: string;
  nama_produk: string;
  avg_rating: number;
  harga: number;
  description: string;
  image: string;
  stock: number;
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
  {
    id_produk: 4,
    id_kategori: 104,
    category: 'Widgets',
    nama_produk: 'Hyper Tool',
    avg_rating: 4.8,
    harga: 499.99,
    description: 'Advanced tool for professionals.',
    image: 'https://placehold.co/600x400',
    stock: 20,
    total_review: 67,
  },
  {
    id_produk: 5,
    id_kategori: 105,
    category: 'Widgets',
    nama_produk: 'Quantum Widget',
    avg_rating: 4.0,
    harga: 599.99,
    description: 'Next-gen widget with quantum technology.',
    image: 'https://placehold.co/600x400',
    stock: 10,
    total_review: 150,
  },
  {
    id_produk: 6,
    id_kategori: 106,
    category: 'Widgets',
    nama_produk: 'Nano Gadget',
    avg_rating: 4.5,
    harga: 129.99,
    description: 'Compact gadget with nano technology.',
    image: 'https://placehold.co/600x400',
    stock: 50,
    total_review: 300,
  },
  { id_produk: 7,
    id_kategori: 107,
    category: 'Widgets',
    nama_produk: 'Micro Widget',
    avg_rating: 4.2,
    harga: 89.99,
    description: 'Small but powerful widget.',
    image: 'https://placehold.co/600x400',
    stock: 100,
    total_review: 50,
  }
];
