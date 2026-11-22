import { getBrowseCategoryId } from "./categoryCatalog";
import {
  BrowseCategoryId,
  CategoryId,
  ExternalProduct,
  ExternalProductsResponse,
  RentalItem,
} from "./types";

const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=200";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
//Memvalidasi bentuk respons API
function isExternalProduct(value: unknown): value is ExternalProduct {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.rating === "number" &&
    typeof value.thumbnail === "string"
  );
}

function isExternalProductsResponse(
  value: unknown,
): value is ExternalProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isExternalProduct)
  );
}

type RentalCategory = {
  categoryId: CategoryId;
  browseCategoryId: BrowseCategoryId;
};

const externalCategoryMap: Record<string, RentalCategory> = {
  laptops: { categoryId: "elektronik", browseCategoryId: "elektronik" },
  smartphones: { categoryId: "elektronik", browseCategoryId: "elektronik" },
  tablets: { categoryId: "elektronik", browseCategoryId: "elektronik" },
  "mobile-accessories": {
    categoryId: "elektronik",
    browseCategoryId: "elektronik",
  },
  "mens-shirts": { categoryId: "fashion", browseCategoryId: "fashion" },
  "mens-shoes": { categoryId: "fashion", browseCategoryId: "fashion" },
  "womens-dresses": { categoryId: "fashion", browseCategoryId: "fashion" },
  "womens-shoes": { categoryId: "fashion", browseCategoryId: "fashion" },
  tops: { categoryId: "fashion", browseCategoryId: "fashion" },
  "sports-accessories": { categoryId: "outdoor", browseCategoryId: "outdoor" },
};

const nonRentalProductPattern =
  /\b(mascara|eyeshadow|lipstick|makeup|cosmetic|skincare|skin care|fragrance|perfume|food|chicken|meat|beef|poultry|grocery|snack|drink|beverage)\b/i;

function getExternalRentalCategory(
  category: string,
  title: string,
): RentalCategory | undefined {
  const normalizedCategory = category
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-");
  const mappedCategory = externalCategoryMap[normalizedCategory];
  if (!mappedCategory || nonRentalProductPattern.test(title)) return undefined;
  return mappedCategory;
}

export function isRentableExternalProduct(product: ExternalProduct): boolean {
  return (
    getExternalRentalCategory(product.category, product.title) !== undefined &&
    /^https?:\/\/\S+$/i.test(product.thumbnail.trim())
  );
}

//Mengubah/menyaring ExternalProduct menjadi RentalItem
function toRentalItem(product: ExternalProduct): RentalItem {
  const rentalCategory = getExternalRentalCategory(
    product.category,
    product.title,
  );
  if (!rentalCategory || !isRentableExternalProduct(product)) {
    throw new Error(
      `Produk "${product.title}" tidak memenuhi kriteria barang rental.`,
    );
  }

  const rentalItem: RentalItem = {
    id: `api-${product.id}`,
    name: product.title,
    categoryId: rentalCategory.categoryId,
    browseCategoryId:
      getBrowseCategoryId(product.category, product.title) ??
      rentalCategory.browseCategoryId,
    // Harga sewa harian adalah estimasi 5% dari harga produk (USD ke IDR, kurs perkiraan Rp16.000).
    pricePerDay: Math.max(
      1000,
      Math.round((product.price * 800) / 1000) * 1000,
    ),
    rating: product.rating,
    imageSeed: `api-${product.id}`,
    imageUrl: product.thumbnail,
  };

  return rentalItem;
}
// Meminta data dari API dan menunggu respons API
function requestJson(url: string, resource = "API"): Promise<unknown> {//Fungsi asynchronous bawaan (pre-built) & then,resolve,recect

  return Promise.resolve()
    .then(() => fetch(url))
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${resource} mengembalikan status ${response.status}.`),
        );
      }

      return response.json();
    });
}
////Custom async function & await
async function requestProducts(url: string): Promise<ExternalProduct[]> {
  const payload = await requestJson(url, "API produk");
  if (!isExternalProductsResponse(payload)) {
    throw new Error("Format respons API produk tidak sesuai.");
  }

  return payload.products;
}

// Mengambil/mengubah jadi aplikasi dengan fetch lalu memasukkannya ke object RentalItem.  cnth PROMISE DAN AWAIT dan cth custom
export async function fetchExternalRentalItems(): Promise<RentalItem[]> {
  const products = await requestProducts(PRODUCTS_API_URL);
  return products.filter(isRentableExternalProduct).map(toRentalItem);
}
//async function
export async function fetchExternalRentalItem(id: number): Promise<RentalItem> {
  const product = await requestJson(
    `https://dummyjson.com/products/${id}`,
    "API produk",
  );
  if (!isExternalProduct(product)) {
    throw new Error("Data produk dari API tidak valid.");
  }
  if (!isRentableExternalProduct(product)) {
    throw new Error(
      `Produk "${product.title}" tidak tersedia untuk katalog rental.`,
    );
  }

  return toRentalItem(product);
}
