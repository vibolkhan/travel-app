import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type FavoriteType = 'destination' | 'hotel' | 'tour';

interface FavoriteItem {
    id: string;
    type: FavoriteType;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    addFavorite: (id: string, type: FavoriteType) => void;
    removeFavorite: (id: string, type: FavoriteType) => void;
    isFavorite: (id: string, type: FavoriteType) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem('favorites-storage-context');
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load favorites', e);
        }
    };

    const saveFavorites = async (newFavorites: FavoriteItem[]) => {
        try {
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favorites-storage-context', JSON.stringify(newFavorites));
        } catch (e) {
            console.error('Failed to save favorites', e);
        }
    };

    const addFavorite = (id: string, type: FavoriteType) => {
        if (favorites.some((f) => f.id === id && f.type === type)) return;
        saveFavorites([...favorites, { id, type }]);
    };

    const removeFavorite = (id: string, type: FavoriteType) => {
        saveFavorites(favorites.filter((f) => !(f.id === id && f.type === type)));
    };

    const isFavorite = (id: string, type: FavoriteType) => {
        return favorites.some((f) => f.id === id && f.type === type);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
