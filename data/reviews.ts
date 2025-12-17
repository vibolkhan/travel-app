// File: data/reviews.ts

import { Review } from '../types/models';

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    type: 'destination',
    targetId: 'dest-siemreap',
    userName: 'Sokha',
    rating: 5,
    dateISO: '2025-10-05',
    text: 'Angkor sunrise was unforgettable. Great tips from the guide!',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'rev-2',
    type: 'hotel',
    targetId: 'hotel-angkor-boutique',
    userName: 'Dara',
    rating: 5,
    dateISO: '2025-09-18',
    text: 'Super friendly staff, clean rooms, and perfect location.',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'rev-3',
    type: 'tour',
    targetId: 'tour-angkor-day',
    userName: 'Mina',
    rating: 4,
    dateISO: '2025-11-01',
    text: 'Good pace, comfortable transport. Bring extra water for heat.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
];
