import { Hotel } from '../types/models';

export const hotels: Hotel[] = [
  {
    id: 'h1',
    destinationId: '1',
    name: 'The Royal Purnama',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
    location: 'Bali, Indonesia',
    rating: 4.9,
    pricePerNight: 280,
    amenities: ['Pool', 'Spa', 'Wifi', 'Breakfast'],
    description: 'A luxurious beachfront resort offering exclusive villas with private pools.',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'https://images.unsplash.com/photo-1540541338287-41700207dee6'],
    reviews: 1240
  },
  {
    id: 'h2',
    destinationId: '3',
    name: 'Hotel Plaza Athénée',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    location: 'Paris, France',
    rating: 5.0,
    pricePerNight: 850,
    amenities: ['Fine Dining', 'Bar', 'Gym', 'Concierge'],
    description: 'Iconic luxury hotel near the Eiffel Tower, known for its red geraniums.',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'],
    reviews: 3200
  },
  {
    id: 'h3',
    destinationId: '2',
    name: 'Kyoto Ryokan Sanga',
    image: 'https://images.unsplash.com/photo-1542051841857-5f906991ddb9',
    location: 'Kyoto, Japan',
    rating: 4.8,
    pricePerNight: 400,
    amenities: ['Onsen', 'Tea Ceremony', 'Garden View', 'Kaiseki Dinner'],
    description: 'Traditional Japanese inn with tatami rooms and hot spring baths.',
    images: ['https://images.unsplash.com/photo-1542051841857-5f906991ddb9', 'https://images.unsplash.com/photo-1606744881471-5f2eae8e5b62'],
    reviews: 540
  }
];
