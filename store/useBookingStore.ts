// File: store/useBookingStore.ts

import { createJSONStorage, persist } from 'zustand/middleware';
import type { BookingDraft, BookingRecord, BookingStatus, Review } from '../types/models';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { reviews as seedReviews } from '../data/reviews';

type BookingState = {
  draft: BookingDraft | null;
  bookings: BookingRecord[];
  localReviews: Review[];

  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;

  addBooking: (b: BookingRecord) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;

  addReview: (r: Review) => void;
  getReviewsFor: (itemType: Review['itemType'], itemId: string) => Review[];
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      draft: null,
      bookings: [],
      localReviews: seedReviews,

      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),

      addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      setBookingStatus: (id, status) =>
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) })),

      addReview: (r) => set((s) => ({ localReviews: [r, ...s.localReviews] })),
      getReviewsFor: (itemType, itemId) => get().localReviews.filter((r) => r.itemType === itemType && r.itemId === itemId),
    }),
    {
      name: 'booking-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (s) => ({ draft: s.draft, bookings: s.bookings, localReviews: s.localReviews }),
    }
  )
);
