import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking } from '../types/models';
import { cancelBookingApi, createBooking, fetchMyBookings } from '../utils/api';
import { useAuth } from './AuthContext';

interface BookingContextType {
    bookings: Booking[];
    loading: boolean;
    addBooking: (booking: Partial<Booking>) => Promise<Booking>;
    getBookingsByStatus: (status: 'pending' | 'completed' | 'cancelled') => Booking[];
    cancelBooking: (id: string) => Promise<void>;
    refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadBookings();
        } else {
            setBookings([]);
        }
    }, [isAuthenticated]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await fetchMyBookings();
            setBookings(data);
            // We could still save to AsyncStorage as a fallback/cache if desired,
            // but let's prioritize the API for now.
            await AsyncStorage.setItem('booking-storage-context', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to load bookings from API, trying storage', e);
            const stored = await AsyncStorage.getItem('booking-storage-context');
            if (stored) {
                setBookings(JSON.parse(stored));
            }
        } finally {
            setLoading(false);
        }
    };

    const addBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
        try {
            if (!user) {
                throw new Error('User must be logged in to create a booking');
            }

            // Map the frontend model to the API model if necessary
            // In our case, the API expects hotelId, roomId, tourId, startDate, endDate, totalPrice.
            const apiData = {
                userId: user.id,
                hotelId: bookingData.type === 'Hotel' ? bookingData.targetId : undefined,
                roomId: bookingData.details?.roomId,
                tourId: bookingData.type === 'Tour' ? bookingData.targetId : undefined,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                totalPrice: bookingData.totalPrice,
                numGuests: bookingData.details?.numGuests || 1,
            };

            const newBooking = await createBooking(apiData);
            setBookings(prev => [newBooking, ...prev]);
            return newBooking;
        } catch (e) {
            console.error('Failed to add booking:', e);
            throw e;
        }
    };

    const getBookingsByStatus = (status: Booking['status']) => {
        return bookings.filter((b) => b.status === status);
    };

    const cancelBooking = async (id: string) => {
        try {
            const success = await cancelBookingApi(id);
            if (success) {
                setBookings(prev => prev.map(b =>
                    b.id === id ? { ...b, status: 'cancelled' as const } : b
                ));
            }
        } catch (e) {
            console.error('Failed to cancel booking:', e);
        }
    };

    const refreshBookings = async () => {
        await loadBookings();
    };

    return (
        <BookingContext.Provider value={{
            bookings,
            loading,
            addBooking,
            getBookingsByStatus,
            cancelBooking,
            refreshBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
