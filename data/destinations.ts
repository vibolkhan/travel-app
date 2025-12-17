import { Destination } from '../types/models';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    location: 'Indonesia',
    rating: 4.8,
    description: 'Tropical paradise with beautiful beaches and vibrant culture.',
    pricePerDay: 120,
    category: 'Beach',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
    ]
  },
  {
    id: '2',
    name: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    location: 'Japan',
    rating: 4.9,
    description: 'Ancient temples, traditional tea houses, and sublime gardens.',
    pricePerDay: 180,
    category: 'Culture',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4'
    ]
  },
  {
    id: '3',
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    location: 'France',
    rating: 4.7,
    description: 'The city of love, art, and exquisite cuisine.',
    pricePerDay: 250,
    category: 'City',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f'
    ]
  },
  {
    id: '4',
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    location: 'Switzerland',
    rating: 4.9,
    description: 'Breathtaking mountain peaks only accessible by train or hike.',
    pricePerDay: 300,
    category: 'Mountain',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
      'https://images.unsplash.com/photo-1502301131665-382a937a090d'
    ]
  }
];
