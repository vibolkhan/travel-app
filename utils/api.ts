import {
    ApiBooking,
    ApiDestination,
    ApiHotel,
    ApiReview,
    ApiRoom,
    ApiTour,
    Booking,
    Destination,
    Hotel,
    LoginResponse,
    Review,
    Room,
    Tour
} from '../types/models';

import { destinations as staticDestinations } from '../data/destinations';
import { tours as staticTours } from '../data/tours';
import { formatDate } from './dates';

const API_BASE_URL = 'https://travel-api-dn8n.onrender.com/api/v1';

// Token storage
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

export const getAuthToken = () => authToken;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(url, { ...options, headers });
};

export const fetchDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();

        // Robust check for array data location
        const apiDestinations: ApiDestination[] = json.data || json.items || (Array.isArray(json) ? json : []);
        console.log(apiDestinations);

        return apiDestinations.map(mapDestinationApiToModel);
    } catch (error) {
        console.error('Failed to fetch destinations:', error);
        // Fallback? For now, re-throw or return empty to let UI handle it. 
        // Let's return empty array so app doesn't crash, but log error.
        throw error;
    }
};

const mapDestinationApiToModel = (apiDest: ApiDestination): Destination => {
    const name = apiDest.nameEn || 'Unknown Destination';
    // Use a deterministic way to pick a placeholder image based on ID or Name
    // to avoid random flickering on re-renders if we used Math.random()
    const valForRandom = (name.length + (apiDest.rating || 0));
    const fallbackIndex = valForRandom % staticDestinations.length;
    const fallbackImage = staticDestinations[fallbackIndex]?.image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4';

    // Randomize category somewhat deterministically or default to Culture
    const categories: Destination['category'][] = ['Beach', 'Mountain', 'City', 'Culture'];
    const catIndex = name.length % categories.length;

    return {
        id: apiDest.id,
        name: name,
        image: (apiDest as any).image || (apiDest as any).imageUrl || fallbackImage,
        location: apiDest.province || 'Cambodia',
        rating: apiDest.rating || 4.5,
        description: apiDest.descriptionEn || 'No description available.',
        pricePerDay: 100 + (name.length * 10), // Mock price
        category: categories[catIndex], // Mock category
        images: [fallbackImage, fallbackImage] // Mock gallery
    };
};

// Tours API
export const fetchTours = async (): Promise<Tour[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/tours`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiTours: ApiTour[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiTours.map(t => mapTourApiToModel(t));
    } catch (error) {
        console.error('Failed to fetch tours:', error);
        throw error;
    }
};

export const fetchTourById = async (id: string): Promise<Tour | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/tours/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        return mapTourApiToModel(json.data || json);
    } catch (error) {
        console.error('Failed to fetch tour:', error);
        throw error;
    }
};

export const fetchToursByDestinationId = async (destId: string): Promise<Tour[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/${destId}/tours`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiTours: ApiTour[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiTours.map(t => mapTourApiToModel(t, destId));
    } catch (error) {
        console.error('Failed to fetch tours by destination:', error);
        throw error;
    }
};

const mapTourApiToModel = (apiTour: ApiTour, destId?: string): Tour => {
    const name = apiTour.titleEn || 'Unknown Tour';
    const valForRandom = (name.length + (apiTour.rating || 0));
    const fallbackIndex = valForRandom % staticTours.length;
    const fallbackImage = staticTours[fallbackIndex]?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800';
    const tourImage = (apiTour as any).image || (apiTour as any).imageUrl || (apiTour as any).images?.[0] || fallbackImage;

    return {
        id: apiTour.id,
        destinationId: destId || apiTour.destinationId || '',
        name: name,
        image: tourImage,
        duration: apiTour.duration || '1 day',
        groupSize: apiTour.groupSize || 10,
        price: apiTour.price || 100,
        rating: apiTour.rating || 4.5,
        description: apiTour.descriptionEn || 'No description available.',
        itinerary: [
            { day: 1, title: 'Day 1', description: 'Tour begins' }
        ],
        included: (() => {
            const arr = ensureArray(apiTour.included);
            return arr.length > 0 ? arr : ['Guide', 'Transportation'];
        })(),
        notIncluded: (() => {
            const arr = ensureArray(apiTour.notIncluded);
            return arr.length > 0 ? arr : ['Meals', 'Personal expenses'];
        })()
    };
};

// Reviews API
export const fetchReviews = async (targetId?: string): Promise<Review[]> => {
    try {
        const url = targetId
            ? `${API_BASE_URL}/reviews?targetId=${targetId}`
            : `${API_BASE_URL}/reviews`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiReviews: ApiReview[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiReviews.map(mapReviewApiToModel);
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        throw error;
    }
};

const mapReviewApiToModel = (apiReview: ApiReview): Review => {
    // Determine targetId from either destination or tour
    const targetId = apiReview.destinationId || apiReview.tourId || '';

    return {
        id: apiReview.id,
        targetId: targetId,
        authorName: 'Anonymous User', // API doesn't provide user names
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        rating: apiReview.rating || 5,
        date: formatDate(apiReview.createdAt),
        text: apiReview.comment || 'No comment provided.'
    };
};

// Destination detail API
export const fetchDestinationById = async (id: string): Promise<Destination | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        return mapDestinationApiToModel(json.data || json);
    } catch (error) {
        console.error('Failed to fetch destination:', error);
        throw error;
    }
};

// Hotels API
export const fetchHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiHotels: ApiHotel[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiHotels.map(h => mapHotelApiToModel(h));
    } catch (error) {
        console.error('Failed to fetch hotels:', error);
        throw error;
    }
};

export const fetchHotelById = async (id: string): Promise<Hotel | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        return mapHotelApiToModel(json.data || json);
    } catch (error) {
        console.error('Failed to fetch hotel:', error);
        throw error;
    }
};

export const fetchHotelsByDestinationId = async (destId: string): Promise<Hotel[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/${destId}/hotels`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiHotels: ApiHotel[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiHotels.map(h => mapHotelApiToModel(h, destId));
    } catch (error) {
        console.error('Failed to fetch hotels by destination:', error);
        throw error;
    }
};

const mapHotelApiToModel = (apiHotel: ApiHotel, destId?: string): Hotel => {
    const name = apiHotel.name || 'Unknown Hotel';
    const fallbackImage = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9';

    // Check multiple possible image fields
    const apiImages = ensureArray(apiHotel.images || (apiHotel as any).image || (apiHotel as any).imageUrl);
    const mainImage = apiImages.length > 0 ? apiImages[0] : fallbackImage;

    // Parse price range to get pricePerNight
    let pricePerNight = 100;
    if (apiHotel.priceRange && typeof apiHotel.priceRange === 'string') {
        const match = apiHotel.priceRange.match(/\d+/);
        if (match) {
            pricePerNight = parseInt(match[0]);
        }
    }

    return {
        id: apiHotel.id,
        destinationId: destId || (apiHotel as any).destinationId || '',
        name: name,
        image: mainImage,
        location: apiHotel.province || apiHotel.location || 'Cambodia',
        rating: apiHotel.starRating || 4.5,
        pricePerNight: pricePerNight,
        amenities: ensureArray(apiHotel.amenities),
        description: apiHotel.address || 'No description available.',
        images: (() => {
            const arr = ensureArray(apiHotel.images);
            return arr.length > 0 ? arr : [fallbackImage];
        })(),
        reviews: 0 // API doesn't provide review count
    };
};

const ensureArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map(s => s.trim());
    return [];
};

// Auth API
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // Store token
        if (data.token) {
            setAuthToken(data.token);
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Add other services here later

// Rooms API
export const fetchRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        const apiRooms: ApiRoom[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiRooms.map(mapRoomApiToModel);
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
        throw error;
    }
};

const mapRoomApiToModel = (apiRoom: ApiRoom): Room => {
    const fallbackImage = 'https://images.unsplash.com/photo-1590490360182-c33d57733427';
    const apiImages = ensureArray(apiRoom.images);

    return {
        id: apiRoom.id,
        hotelId: apiRoom.hotelId,
        roomNumber: apiRoom.roomNumber || 'N/A',
        roomType: apiRoom.roomType || 'Standard',
        capacity: apiRoom.capacity || 2,
        floor: apiRoom.floor,
        pricePerNight: apiRoom.pricePerNight || 0,
        description: apiRoom.description || 'No description available.',
        amenities: ensureArray(apiRoom.amenities),
        images: apiImages.length > 0 ? apiImages : [fallbackImage],
        isAvailable: apiRoom.isAvailable ?? true
    };
};

// Booking API
export const fetchMyBookings = async (): Promise<Booking[]> => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/bookings`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();
        // Documentation says it returns paginated bookings.
        // Assuming data is in 'data' or 'items' property if wrapped
        const apiBookings: ApiBooking[] = json.data || json.items || (Array.isArray(json) ? json : []);
        return apiBookings.map(mapBookingApiToModel);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        throw error;
    }
};

export async function createBooking(data: any) {
  const token = await getAuthToken();
  if (!token) {
    const err: any = new Error("NO_TOKEN");
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    const err: any = new Error("UNAUTHORIZED");
    err.status = 401;
    throw err;
  }

  return await res.json();
}

export const cancelBookingApi = async (id: string): Promise<boolean> => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/bookings/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        return false;
    }
};

const mapBookingApiToModel = (apiBooking: ApiBooking): Booking => {
    const isHotel = !!apiBooking.hotelId;

    return {
        id: apiBooking.id,
        userId: apiBooking.userId,
        type: isHotel ? 'Hotel' : 'Tour',
        targetId: (apiBooking.hotelId || apiBooking.tourId || ''),
        title: isHotel ? 'Hotel Stay' : 'Tour Package', // Better if we had the title from API expansion
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', // Placeholder
        checkIn: apiBooking.checkIn,
        checkOut: apiBooking.checkOut,
        status: apiBooking.status,
        numGuests: apiBooking.numGuests,
        totalPrice: apiBooking.totalPrice,
        details: {
            roomNumber: (apiBooking as any).roomNumber,
            numGuests: apiBooking.numGuests
        }
    };
};
