// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// API Response types
export interface ApiDestination {
  id: string;
  nameEn: string;
  nameKh: string;
  descriptionEn: string;
  descriptionKh: string;
  province: string;
  lat: number;
  lng: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  // TODO: Verify if API has images, otherwise we might need to fetch them separately or use placeholders
}

export interface ApiTour {
  id: string;
  titleEn: string;
  titleKh: string;
  descriptionEn: string;
  descriptionKh: string;
  price: number;
  duration: string;
  groupSize: number;
  rating: number;
  destinationId: string;
  included?: string[];
  notIncluded?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiReview {
  id: string;
  userId: string;
  destinationId: string;
  tourId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHotel {
  id: string;
  name: string;
  province: string;
  address: string;
  location: string;
  images?: string[];
  starRating: number;
  priceRange: string;
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  floor?: number | null;
  pricePerNight: number;
  description?: string | null;
  amenities?: string[] | null;
  images?: string[] | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBooking {
  id: string;
  userId: string;
  hotelId?: string;
  roomId?: string;
  tourId?: string;
  checkIn: string;
  checkOut?: string;
  numGuests?: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}




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
  roomNumber: string;
  roomType: string;
  capacity: number;
  floor?: number | null;
  pricePerNight: number;
  description: string;
  amenities: string[];
  images: any[];
  isAvailable: boolean;
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
  checkIn: string;
  checkOut?: string;
  numGuests?: number;
  status: 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  details?: {
    roomNumber?: string;
    numGuests?: number;
    [key: string]: any;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: any;
}
