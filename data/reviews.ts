import { Review } from '../types/models';

export const reviews: Review[] = [
  {
    id: 'rev1',
    targetId: 'h1',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    date: '2023-10-15',
    text: 'Absolutely stunning resort! The staff were incredibly friendly and the villa was perfect.'
  },
  {
    id: 'rev2',
    targetId: 'h1',
    authorName: 'Michael Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    date: '2023-09-20',
    text: 'Great place, but the food was a bit pricey.'
  },
  {
    id: 'rev3',
    targetId: 't1',
    authorName: 'Emily Clark',
    authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    date: '2023-11-02',
    text: 'The best tour guide ever! Learned so much about Bali culture.'
  }
];
