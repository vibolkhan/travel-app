import { Room } from '../types/models';

export const rooms: Room[] = [
  {
    id: 'r1',
    hotelId: 'h1',
    name: 'Ocean View Suite',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    capacity: 2,
    bedType: 'King Bed',
    price: 350,
    amenities: ['Ocean View', 'Balcony', 'Free Wifi', 'Bathtub']
  },
  {
    id: 'r2',
    hotelId: 'h1',
    name: 'Garden Villa',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6',
    capacity: 4,
    bedType: '2 Queen Beds',
    price: 550,
    amenities: ['Private Pool', 'Garden', 'Living Room', 'Kitchenette']
  },
  {
    id: 'r3',
    hotelId: 'h2',
    name: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
    capacity: 2,
    bedType: 'Queen Bed',
    price: 850,
    amenities: ['City View', 'Minibar', 'Marble Bath', 'Room Service']
  }
];
