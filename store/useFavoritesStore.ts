// File: store/useFavoritesStore.ts

import { createJSONStorage, persist } from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type FavoriteType = 'destination' | 'hotel' | 'tour';

type FavoritesState = {
  destinationIds: string[];
  hotelIds: string[];
  tourIds: string[];
  toggle: (type: FavoriteType, id: string) => void;
  isFavorite: (type: FavoriteType, id: string) => boolean;
  clearAll: () => void;
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      destinationIds: [],
      hotelIds: [],
      tourIds: [],
      toggle: (type, id) => {
        const key = type === 'destination' ? 'destinationIds' : type === 'hotel' ? 'hotelIds' : 'tourIds';
        set((s) => {
          const list = (s as any)[key] as string[];
          const exists = list.includes(id);
          const next = exists ? list.filter((x) => x !== id) : uniq([...list, id]);
          return { [key]: next } as any;
        });
      },
      isFavorite: (type, id) => {
        const s = get();
        if (type === 'destination') return s.destinationIds.includes(id);
        if (type === 'hotel') return s.hotelIds.includes(id);
        return s.tourIds.includes(id);
      },
      clearAll: () => set({ destinationIds: [], hotelIds: [], tourIds: [] }),
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
