// File: data/hotels.ts

import { Hotel } from '../types/models';

export const hotels: Hotel[] = [
  {
    id: 'hotel-bali-1',
    destinationId: 'dest-bali',
    name: 'Oceanfront Retreat',
    location: 'Seminyak',
    rating: 4.7,
    pricePerNight: 140,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'gym'],
    description: 'A modern resort with ocean views, pool lounges, and spa treatments.',
  },
  {
    id: 'hotel-sr-1',
    destinationId: 'dest-siemreap',
    name: 'Temple View Hotel',
    location: 'Siem Reap Center',
    rating: 4.6,
    pricePerNight: 65,
    image: 'https://images.unsplash.com/photo-1551887373-6f64d6a5f74d?auto=format&fit=crop&w=1200&q=80',
    amenities: ['wifi', 'breakfast', 'parking', 'pool'],
    description: 'Comfort steps away from markets, with daily breakfast and a calm pool.',
  },
  {
    id: 'hotel-tokyo-1',
    destinationId: 'dest-tokyo',
    name: 'Shibuya Stay',
    location: 'Shibuya',
    rating: 4.4,
    pricePerNight: 180,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    amenities: ['wifi', 'gym'],
    description: 'Compact luxury near the action—perfect for city explorers.',
  },
  {
    id: 'hotel-alps-1',
    destinationId: 'dest-alps',
    name: 'Mountain Chalet',
    location: 'Interlaken',
    rating: 4.9,
    pricePerNight: 220,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    amenities: ['wifi', 'breakfast', 'spa', 'parking'],
    description: 'Cozy chalet vibes with panoramic views and easy access to trails.',
  },
];
