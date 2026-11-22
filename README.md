# Sewakuy – Tugas Pekan Demo Modul 1

Aplikasi rental barang (React Native + Expo Router + TypeScript).

1. `npm install`
2. `npx expo start --go` atau `npx expo start --web`

## Integrasi External API, Interface, dan Async

Aplikasi mengambil daftar dan detail produk dari DummyJSON. Interface mendefinisikan bentuk data yang diharapkan dari API dan model produk yang dipakai aplikasi (`ExternalProduct`, `ExternalProductsResponse`, dan `RentalItem`) berada di `src/constants/types.ts`.

Contoh interface respons API:

```ts
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
```

`interface` adalah kontrak bentuk object saat pemeriksaan TypeScript. Contohnya, `ExternalProduct` mengharuskan object mempunyai `id` berupa angka dan `title` berupa string. Interface tidak memvalidasi data JSON saat aplikasi berjalan, jadi `src/constants/externalApi.ts` menerima hasil JSON sebagai `unknown` lalu memeriksa bentuknya sebelum digunakan.

Alur sederhananya:

1. `requestJson` menggunakan `fetch` untuk mengirim permintaan. Respons HTTP yang gagal menghasilkan error.
2. `requestProducts` memastikan respons memiliki `products` yang seluruh elemennya sesuai `ExternalProduct`.
3. `toRentalItem` memetakan field API ke object aplikasi yang memenuhi interface `RentalItem`.
4. `fetchExternalRentalItems` mengembalikan daftar `RentalItem[]`; halaman katalog menyimpan hasilnya dan menampilkan error jika permintaan gagal.

Contoh pemetaan object:

```ts
const rentalItem: RentalItem = {
  id: `api-${product.id}`,
  name: product.title,
  categoryId: rentalCategory.categoryId,
  pricePerDay: Math.max(
    1000,
    Math.round((product.price * 800) / 1000) * 1000,
  ),
  rating: product.rating,
  imageSeed: `api-${product.id}`,
  imageUrl: product.thumbnail,
};
```

Pemanggilan di halaman katalog dilakukan melalui `fetchExternalRentalItems()`. Fungsi itu bersifat `async` dan bertipe `Promise<RentalItem[]>`: `await` menunggu data selesai diambil, sementara `.then()` menangani hasil dan `.catch()` menangani error. Kode lengkapnya ada di `src/constants/externalApi.ts` dan penggunaannya di `src/app/(tabs)/index.tsx`.
