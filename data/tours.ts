// File: data/tours.ts

import { Tour } from '../types/models';

export const tours: Tour[] = [
  {
    id: 'tour-angkor-sunrise',
    destinationId: 'dest-siemreap',
    title: 'Angkor Sunrise & Temples',
    image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    priceFrom: 25,
    durationHours: 8,
    groupSize: 12,
    description: 'Start at sunrise, explore Angkor Wat and nearby masterpieces with a local guide.',
    itinerary: ['Sunrise at Angkor Wat', 'Bayon Temple', 'Ta Prohm', 'Local lunch stop'],
    included: ['Guide', 'Cold water', 'Hotel pickup'],
    notIncluded: ['Temple pass', 'Meals'],
  },
  {
    id: 'tour-bali-sunset',
    destinationId: 'dest-bali',
    title: 'Bali Sunset & Beach Clubs',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    priceFrom: 45,
    durationHours: 6,
    groupSize: 10,
    description: 'Hop between iconic beach spots and end with a legendary sunset view.',
    itinerary: ['Beach stop', 'Hidden café', 'Beach club sunset', 'Photo session'],
    included: ['Guide', 'Transport'],
    notIncluded: ['Food & drinks'],
  },
  {
    id: 'tour-tokyo-night',
    destinationId: 'dest-tokyo',
    title: 'Tokyo Night Street Food',
    image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    priceFrom: 60,
    durationHours: 3,
    groupSize: 8,
    description: 'A curated night walk for must-try bites and local hidden gems.',
    itinerary: ['Izakaya alley', 'Ramen stop', 'Dessert spot'],
    included: ['Guide'],
    notIncluded: ['Food costs'],
  },
];
