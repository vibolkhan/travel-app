import { Tour } from '../types/models';

export const tours: Tour[] = [
  {
    id: 't1',
    destinationId: '1',
    name: 'Bali Temple & Waterfall Tour',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
    duration: '1 Day',
    groupSize: 10,
    price: 65,
    rating: 4.7,
    description: 'Explore the most iconic temples and hidden waterfalls of Bali.',
    itinerary: [
      { day: 1, title: 'Morning', description: 'Visit Lempuyang Temple' },
      { day: 1, title: 'Afternoon', description: 'Swim at Tirta Gangga' }
    ],
    included: ['Transport', 'Guide', 'Entrance Fees', 'Lunch'],
    notIncluded: ['Tips']
  },
  {
    id: 't2',
    destinationId: '2',
    name: 'Kyoto Cultural Immersion',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3',
    duration: '3 Days',
    groupSize: 6,
    price: 450,
    rating: 4.9,
    description: 'A deep dive into Japanese traditions, tea ceremonies, and history.',
    itinerary: [
      { day: 1, title: 'Arashiyama', description: 'Bamboo Grove and Monkey Park' },
      { day: 2, title: 'Gion', description: 'Geisha district walking tour' },
      { day: 3, title: 'Fushimi Inari', description: 'Hike up the mountain' }
    ],
    included: ['Accommodation', 'High-speed Train', 'Meals', 'Workshops'],
    notIncluded: ['Flights', 'Insurance']
  }
];
