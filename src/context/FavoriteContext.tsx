import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import type { RentalItem } from "../constants/types";

interface FavoriteContextType {
  favorites: RentalItem[];
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (item: RentalItem) => void;
}

const FavoriteContext = createContext<FavoriteContextType | null>(null);

const STORAGE_KEY = "@sewakuy_favorites";

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<RentalItem[]>([]);

  // Muat data favorit dari penyimpanan
  useEffect(() => {
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.warn("Gagal memuat favorites:", e);
    }
  }, []);

  const saveFavorites = (items: RentalItem[]) => {
    setFavorites(items);
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn("Gagal menyimpan favorites:", e);
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const toggleFavorite = (item: RentalItem) => {
    const exists = isFavorite(item.id);
    if (exists) {
      const updated = favorites.filter((fav) => fav.id !== item.id);
      saveFavorites(updated);
    } else {
      const updated = [item, ...favorites];
      saveFavorites(updated);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites harus digunakan di dalam FavoriteProvider");
  }
  return context;
}
