import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking } from '../types/models';

interface BookingContextType {
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    getBookingsByStatus: (status: 'Upcoming' | 'Completed' | 'Cancelled') => Booking[];
    cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const stored = await AsyncStorage.getItem('booking-storage-context');
            if (stored) {
                const parsedBookings: Booking[] = JSON.parse(stored);

                // Auto-complete past bookings
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                let hasUpdates = false;
                const updatedBookings = parsedBookings.map(b => {
                    if (b.status === 'Upcoming') {
                        // Use endDate if available, otherwise startDate
                        const dateStr = b.endDate || b.startDate;

                        // Parse YYYY-MM-DD to local date to avoid UTC timezone issues
                        const [y, m, d] = dateStr.split('-').map(Number);
                        const bookingDate = new Date(y, m - 1, d);

                        // If the booking date is strictly before today (midnight), it's completed
                        if (bookingDate < now) {
                            hasUpdates = true;
                            return { ...b, status: 'Completed' as const };
                        }
                    }
                    return b;
                });

                if (hasUpdates) {
                    setBookings(updatedBookings);
                    // We define saveBookings below, but we can't call it easily here if it relies on setBookings helper which saves to storage.
                    // Actually, saveBookings helper just overwrites storage.
                    // Code below defines saveBookings. We should manually save to storage here to avoid issues or move logic.
                    // Or easier: just call the storage setItem directly here for the update, since saveBookings isn't hoisted or available in closure in the same way depending on definition (it's defined below).
                    // Actually saveBookings is defined in the component scope, so it IS available.
                    // But wait, saveBookings calls setBookings.
                    // Let's just update storage and state.
                    await AsyncStorage.setItem('booking-storage-context', JSON.stringify(updatedBookings));
                    setBookings(updatedBookings);
                } else {
                    setBookings(parsedBookings);
                }
            }
        } catch (e) {
            console.error('Failed to load bookings', e);
        }
    };

    const saveBookings = async (newBookings: Booking[]) => {
        try {
            setBookings(newBookings);
            await AsyncStorage.setItem('booking-storage-context', JSON.stringify(newBookings));
        } catch (e) {
            console.error('Failed to save bookings', e);
        }
    };

    const addBooking = (booking: Booking) => {
        if (bookings.some((b) => b.id === booking.id)) return;
        saveBookings([booking, ...bookings]);
    };

    const getBookingsByStatus = (status: 'Upcoming' | 'Completed' | 'Cancelled') => {
        return bookings.filter((b) => b.status === status);
    };

    const cancelBooking = (id: string) => {
        const updatedBookings = bookings.map(b =>
            b.id === id ? { ...b, status: 'Cancelled' as const } : b
        );
        saveBookings(updatedBookings);
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, getBookingsByStatus, cancelBooking }}>
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
