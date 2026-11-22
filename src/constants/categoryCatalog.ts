import type { BrowseCategoryId, CategoryId, RentalItem } from "./types";

const externalCategoryMap: Record<string, BrowseCategoryId> = {
  "sports-accessories": "outdoor",
  "mens-shirts": "fashion",
  "mens-shoes": "fashion",
  "womens-dresses": "fashion",
  "womens-shoes": "fashion",
  tops: "fashion",
  laptops: "elektronik",
  smartphones: "elektronik",
  tablets: "elektronik",
  "mobile-accessories": "elektronik",
  furniture: "acara",
  "home-decoration": "acara",
  "kitchen-accessories": "acara",
};

export function getBrowseCategoryId(
  category: string,
  title: string
): BrowseCategoryId | undefined {
  const normalizedCategory = category.toLowerCase().trim().replace(/[_\s]+/g, "-");
  const categoryMatch = externalCategoryMap[normalizedCategory];
  if (categoryMatch) return categoryMatch;

  const normalizedTitle = title.toLowerCase();

  if (/(camera|kamera|photograph|fotografi|lens|lensa|tripod|drone)/.test(normalizedTitle)) {
    return "kamera";
  }
  if (/(toy|mainan|game|console|playstation|xbox|puzzle|hiburan)/.test(normalizedTitle)) {
    return "hiburan";
  }
  if (/(tool|perkakas|hammer|palu|drill|bor|wrench|obeng|saw|gergaji)/.test(normalizedTitle)) {
    return "perkakas";
  }
  if (/(baby|bayi|anak|stroller|car seat|crib|kereta dorong)/.test(normalizedTitle)) {
    return "bayi";
  }
  if (normalizedCategory === "outdoor") return "outdoor";
  if (normalizedCategory === "fashion") return "fashion";
  if (normalizedCategory === "elektronik") return "elektronik";
  if (normalizedCategory === "acara") return "acara";
  if (/(tent|camping|sleeping[- ]bag|hiking|outdoor|sports[- ]equipment)/.test(normalizedTitle)) {
    return "outdoor";
  }
  if (/(laptop|smartphone|phone|tablet|computer|headphone|earbud|speaker|monitor|electronic)/.test(normalizedTitle)) {
    return "elektronik";
  }
  if (/(shirt|shoe|sneaker|dress|clothing|jeans|jacket|trouser|top|suit|costume|fashion)/.test(normalizedTitle)) {
    return "fashion";
  }
  if (/(projector|proyektor|speaker|audio|sound[- ]system|headphone|earbud)/.test(normalizedTitle)) {
    return "elektronik";
  }
  if (/(furniture|decor|kitchen|chair|table|lamp|lighting|sofa|party|wedding|event)/.test(normalizedTitle)) {
    return "acara";
  }

  return undefined;
}

type SeedCategory = Exclude<BrowseCategoryId, "outdoor" | "fashion" | "acara">;

type SeedProduct = {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: CategoryId;
  browseCategoryId: SeedCategory;
  pricePerDay: number;
};

const seedProducts: SeedProduct[] = [
  {
    id: "sample-electronics-phone",
    name: "Smartphone untuk Disewa",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "elektronik",
    pricePerDay: 75000,
  },
  {
    id: "sample-camera-1",
    name: "Kamera Mirrorless",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "kamera",
    pricePerDay: 150000,
  },
  {
    id: "sample-camera-2",
    name: "Kamera DSLR",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "kamera",
    pricePerDay: 135000,
  },
  {
    id: "sample-camera-3",
    name: "Lensa Kamera",
    imageUrl: "https://images.unsplash.com/photo-1510127034890-1e1d5e0e6f67?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "kamera",
    pricePerDay: 85000,
  },
  {
    id: "sample-camera-4",
    name: "Kamera Aksi",
    imageUrl: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "kamera",
    pricePerDay: 60000,
  },
  {
    id: "sample-camera-5",
    name: "Tripod Fotografi",
    imageUrl: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?auto=format&fit=crop&w=800&q=80",
    categoryId: "elektronik",
    browseCategoryId: "kamera",
    pricePerDay: 25000,
  },
  {
    id: "sample-toy-1",
    name: "Set Mainan Edukasi Anak",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "hiburan",
    pricePerDay: 20000,
  },
  {
    id: "sample-toy-2",
    name: "Konsol Game",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "hiburan",
    pricePerDay: 85000,
  },
  {
    id: "sample-toy-3",
    name: "Board Game Keluarga",
    imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b2f3ac?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "hiburan",
    pricePerDay: 15000,
  },
  {
    id: "sample-toy-4",
    name: "Set Balok Susun",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "hiburan",
    pricePerDay: 18000,
  },
  {
    id: "sample-toy-5",
    name: "Perlengkapan Karaoke",
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "hiburan",
    pricePerDay: 50000,
  },
  {
    id: "sample-tool-1",
    name: "Bor Listrik",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "perkakas",
    pricePerDay: 35000,
  },
  {
    id: "sample-tool-2",
    name: "Kotak Perkakas",
    imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "perkakas",
    pricePerDay: 25000,
  },
  {
    id: "sample-tool-3",
    name: "Mesin Gerinda",
    imageUrl: "https://images.unsplash.com/photo-1581147036324-c17d5c2f4a1f?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "perkakas",
    pricePerDay: 40000,
  },
  {
    id: "sample-tool-4",
    name: "Gergaji Listrik",
    imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "perkakas",
    pricePerDay: 45000,
  },
  {
    id: "sample-tool-5",
    name: "Tangga Lipat",
    imageUrl: "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80",
    categoryId: "aksesoris",
    browseCategoryId: "perkakas",
    pricePerDay: 30000,
  },
  {
    id: "sample-baby-1",
    name: "Kereta Dorong Bayi",
    imageUrl: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
    browseCategoryId: "bayi",
    pricePerDay: 50000,
  },
  {
    id: "sample-baby-2",
    name: "Kursi Mobil Bayi",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
    browseCategoryId: "bayi",
    pricePerDay: 40000,
  },
  {
    id: "sample-baby-3",
    name: "Boks Bayi Portable",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
    browseCategoryId: "bayi",
    pricePerDay: 45000,
  },
  {
    id: "sample-baby-4",
    name: "Kursi Makan Bayi",
    imageUrl: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
    browseCategoryId: "bayi",
    pricePerDay: 30000,
  },
  {
    id: "sample-baby-5",
    name: "Gendongan Bayi",
    imageUrl: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
    browseCategoryId: "bayi",
    pricePerDay: 20000,
  },
];

export const categoryFallbackItems: RentalItem[] = seedProducts.map((product) => ({
  ...product,
  rating: 4.8,
  imageSeed: product.id,
  badge: "Contoh katalog",
}));

export function getItemBrowseCategory(item: RentalItem): BrowseCategoryId | undefined {
  return item.browseCategoryId ?? getBrowseCategoryId(item.categoryId, item.name);
}

export type { BrowseCategoryId };
