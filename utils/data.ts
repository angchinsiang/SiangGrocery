import { Order } from './types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'Or123456789der',
    status: 'delivered',
    statusText: 'Items are successfully delivered. Thank you for shopping with us!',
    recipient: 'Lydia',
    deliveryAddress: 'No 123, Jalan Intan 100, Taman Pangkalan Barat, 33990 Perak Malaysia',
    items: [
      {
        id: 'item-1',
        name: 'Gourmet Thick-Cut Striploin (500g)',
        originalPrice: 10.99,
        salePrice: 8.99,
        quantity: 1,
        origin: 'Austrialia',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx7sSX5tXEZNLOWH_PPLyu9-jWDwVOvJZtfkiupx-qlPSN1PzRnZknw9xF0luF9sFEtRFRzVJlzovOse59D5d1vpemBWN5LuTApVoHnFNl0djd5_0vOWlXjBOavmEvQRznqlHyoSUb1EmyGE0zoe6PZJrewU9UgnD3VPI3jPdzapIFPnFqPEz8SiBSrNqlz0U8gl-L8JYlrx2c4Oc2QW3WDibgm7g9VIUudRll33p9NUBQfmyUiPBD3xbdz5gKK8PUyCLnnrI0NWU'
      },
      {
        id: 'item-2',
        name: 'Farm-Fresh Whole Milk',
        originalPrice: 3.99,
        salePrice: 2.49,
        quantity: 1,
        origin: 'Austrialia',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmJkm8ffwAWW7bx7yNfZNcp5UZ0qQdIBU948_dHMhh5i9fJDIfAQD3FuRkb_JRMaldAaT0fyi7_oJt5u47tKf8-auOXVjAq1PCPxjES-giIktj39dis2UyqpdMFW0lnXqLrO5hZ-Hk7Dbb_JVUvkZ5_MGL5DYdGSbDpFkcM1XU_g2GaqEYNKfbHgKGaw21kkmhcHZ9V1XkN9GYWW3W47HYX_JX40pZXOzT5RmV8bAq2oW8uisHvxrEGZCt5VvAF5rwSUwRbozv_-0'
      }
    ],
    shippingFee: 2.00,
    discount: 0.00,
    paymentMethod: 'FPX',
    createdAt: '03-03-2026 11:00:00',
    shippedAt: '03-03-2026 13:00:00',
    completedAt: '03-03-2026 17:00:00',
    remark: 'Give the product extra protection. Thanks.'
  },
  {
    id: 'Or987654321proc',
    status: 'processing',
    statusText: 'Your order is currently being packed with fresh items at our warehouse.',
    recipient: 'Alex Tan',
    deliveryAddress: 'A-12-3 Condominium Indah, Jalan Ipoh, 51200 Kuala Lumpur Malaysia',
    items: [
      {
        id: 'item-3',
        name: 'Organic Crisp Honeycrisp Apples (1kg)',
        originalPrice: 6.99,
        salePrice: 5.49,
        quantity: 2,
        origin: 'New Zealand',
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'item-4',
        name: 'Premium Avocado Hass (3pcs Bundle)',
        originalPrice: 7.50,
        salePrice: 5.99,
        quantity: 1,
        origin: 'Mexico',
        imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=300'
      }
    ],
    shippingFee: 3.50,
    discount: 1.50,
    paymentMethod: 'DuitNow QR',
    createdAt: '03-04-2026 09:12:00',
    remark: 'Please ensure apples are not bruised. Choose firm avocados.'
  },
  {
    id: 'Or456789123ship',
    status: 'shipped',
    statusText: 'Your order has left our facility and is on the way to your location.',
    recipient: 'Sarah Lim',
    deliveryAddress: 'No 45, Lorong Damai 4, Taman Melawati, 53100 Selangor Malaysia',
    items: [
      {
        id: 'item-5',
        name: 'Specialty Roasted Ground Coffee (250g)',
        originalPrice: 12.00,
        salePrice: 9.99,
        quantity: 1,
        origin: 'Colombia',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'item-6',
        name: 'Fresh Blueberries Premium Pack (125g)',
        originalPrice: 4.50,
        salePrice: 3.49,
        quantity: 3,
        origin: 'Chile',
        imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=300'
      }
    ],
    shippingFee: 2.00,
    discount: 0.00,
    paymentMethod: 'FPX',
    createdAt: '03-03-2026 08:30:00',
    shippedAt: '03-03-2026 14:15:00',
    remark: 'Leave at guardhouse if not home. Call upon arrival.'
  }
];
