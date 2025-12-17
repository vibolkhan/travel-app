export interface Destination {
  id: string;
  name: string;
  image: any; // Using any for require() or uri
  location: string;
  rating: number;
  description: string;
  pricePerDay: number;
  category: 'Beach' | 'Mountain' | 'City' | 'Culture';
  images: any[];
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  image: any;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
  images: any[];
  reviews: number;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  image: any;
  capacity: number;
  bedType: string;
  price: number;
  amenities: string[];
}

export interface Tour {
  id: string;
  destinationId: string;
  name: string;
  image: any;
  duration: string;
  groupSize: number;
  price: number;
  rating: number;
  description: string;
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  notIncluded: string[];
}

export interface Review {
  id: string;
  targetId: string;
  authorName: string;
  authorAvatar: any;
  rating: number;
  date: string;
  text: string;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'Hotel' | 'Tour';
  targetId: string;
  title: string;
  image: any;
  startDate: string;
  endDate?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  totalPrice: number;
  details?: any; // Room details or Tour details
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: any;
}
