import { MaterialCommunityIcons } from "@expo/vector-icons";

// Union type: id kategori hanya boleh salah satu dari 5 nilai ini
export type CategoryId =
  | "elektronik"
  | "fashion"
  | "outdoor"
  | "aksesoris"
  | "acara";
export type BrowseCategoryId =
  | "outdoor"
  | "fashion"
  | "elektronik"
  | "kamera"
  | "hiburan"
  | "acara"
  | "perkakas"
  | "bayi";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface Category {
  readonly id: CategoryId;
  name: string;
  shortName: string;
  icon: IconName;
  color: string; // warna icon
  bg: string; // warna latar bulatan icon
}

export interface RentalItem {
  readonly id: string;
  name: string;
  categoryId: CategoryId;
  browseCategoryId?: BrowseCategoryId;
  pricePerDay: number;
  rating: number;
  distanceKm?: number;
  area?: string;
  imageSeed: string;
  imageUrl?: string;
  badge?: string; // opsional
}

//  Interface untuk mendefinisikan bentuk data produk dari External API.
export interface ExternalProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
}

export interface ExternalProductsResponse {
  products: ExternalProduct[];
}
