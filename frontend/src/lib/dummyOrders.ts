export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

export const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    date: '2025-01-10',
    status: 'shipped',
    items: [
      {
        id: '1',
        name: 'LCD Monitor',
        price: 650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop'
      },
      {
        id: '2',
        name: 'Hi Gamepad',
        price: 550,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
            {
        id: '3',
        name: 'Hi Gamepad',
        price: 550,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      }

    ],
    subtotal: 1750,
    shipping: 0,
    tax: 175,
    discount: 87.5,
    total: 1837.5,
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    paymentMethod: 'Credit Card ****1234',
    trackingNumber: 'TRK123456789'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    date: '2025-01-08',
    status: 'delivered',
    items: [
      {
        id: '3',
        name: 'Wireless Headphones',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      }
    ],
    subtotal: 299,
    shipping: 15,
    tax: 29.9,
    discount: 0,
    total: 343.9,
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    },
    paymentMethod: 'PayPal',
    trackingNumber: 'TRK987654321'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    date: '2025-01-12',
    status: 'processing',
    items: [
      {
        id: '4',
        name: 'Mechanical Keyboard',
        price: 129,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555617983-1f174153cc6e?w=300&h=300&fit=crop'
      },
      {
        id: '5',
        name: 'Gaming Mouse',
        price: 79,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
      }
    ],
    subtotal: 208,
    shipping: 10,
    tax: 20.8,
    discount: 20.8,
    total: 218,
    shippingAddress: {
      name: 'Mike Johnson',
      address: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States'
    },
    paymentMethod: 'Credit Card ****5678'
  }
];
