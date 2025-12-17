// File: types/models.ts
export type Category = 'Beach' | 'Mountain' | 'City' | 'Culture';

export type Destination = {
  id: string;
  name: string;
  location: string;
  category: Category;
  rating: number; // 0..5
  priceFrom: number; // USD
  image: string;
  description: string;
  highlights: string[];
};

export type Hotel = {
  id: string;
  destinationId: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number; // USD
  image: string;
  images?: string[];
  amenities: ('wifi' | 'pool' | 'breakfast' | 'parking' | 'spa' | 'gym')[];
  description: string;
};

export type Room = {
  id: string;
  hotelId: string;
  name: string;
  image: string;
  pricePerNight: number; // USD
  capacity: number;
  bedType: 'Single' | 'Double' | 'Queen' | 'King' | 'Twin';
  amenities: ('wifi' | 'ac' | 'tv' | 'balcony' | 'minibar' | 'bath')[];
  refundable: boolean;
};

export type Tour = {
  id: string;
  destinationId: string;
  title: string;
  image: string;
  rating: number;
  priceFrom: number; // USD
  durationHours: number;
  groupSize: number;
  description: string;
  itinerary: string[];
  included: string[];
  notIncluded: string[];
};

export type Review = {
  id: string;
  itemType: 'destination' | 'hotel' | 'tour';
  itemId: string;
  author: string;
  avatar: string;
  rating: number; // 1..5
  dateISO: string;
  text: string;
};

export type BookingKind = 'hotel' | 'tour';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type BookingDraft = {
  kind: BookingKind;
  itemId: string; // hotelId or tourId
  roomId?: string; // for hotel booking
  checkInISO: string;
  checkOutISO: string;
  guests: number;
};

export type BookingRecord = {
  id: string;
  kind: BookingKind;
  itemId: string;
  roomId?: string;
  checkInISO: string;
  checkOutISO: string;
  guests: number;
  base: number;
  taxes: number;
  fees: number;
  total: number;
  status: BookingStatus;
  createdAtISO: string;
};
