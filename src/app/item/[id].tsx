import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatDistance, formatRupiah, getCategory, items } from "../../constants/data";
import { fetchExternalRentalItem } from "../../constants/externalApi";
import type { CategoryId, RentalItem } from "../../constants/types";
import { createRentalOrder, useRentals } from "../../context/RentalContext";
import { colors, styles } from "../../theme/styles";

const categoryIds: CategoryId[] = ["elektronik", "fashion", "outdoor", "aksesoris", "acara"];

function isCategoryId(value: string): value is CategoryId {
  return categoryIds.some((categoryId) => categoryId === value);
}

function isRentalItem(value: unknown): value is RentalItem {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string" ||
    !("name" in value) ||
    typeof value.name !== "string" ||
    !("categoryId" in value) ||
    typeof value.categoryId !== "string" ||
    !isCategoryId(value.categoryId) ||
    !("pricePerDay" in value) ||
    typeof value.pricePerDay !== "number" ||
    !("rating" in value) ||
    typeof value.rating !== "number" ||
    !("imageSeed" in value) ||
    typeof value.imageSeed !== "string"
  ) {
    return false;
  }

  return (
    (!("distanceKm" in value) || value.distanceKm === undefined || typeof value.distanceKm === "number") &&
    (!("area" in value) || value.area === undefined || typeof value.area === "string") &&
    (!("imageUrl" in value) || value.imageUrl === undefined || typeof value.imageUrl === "string") &&
    (!("badge" in value) || value.badge === undefined || typeof value.badge === "string")
  );
}

function parseRentalItem(value: string | string[] | undefined): RentalItem | null {
  if (typeof value !== "string") return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return isRentalItem(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function ItemDetail() {
  const router = useRouter();
  const { addOrder } = useRentals();
  
  // Modul 2: useLocalSearchParams untuk mengambil parameter URL aktif
  const { id, days, item: itemParam } = useLocalSearchParams<{
    id: string;
    days?: string;
    item?: string;
  }>();

  // Modul 2: useState untuk state re-render
  const [rentalDays, setRentalDays] = useState<number>(Number(days) || 1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [externalRequest, setExternalRequest] = useState<{
    id: string;
    item?: RentalItem;
    error?: string;
  } | null>(null);

  // Modul 2: useRef untuk menyimpan nilai tanpa re-render
  const adjustCountRef = useRef<number>(0);

  const passedItem = parseRentalItem(itemParam);
  const matchingPassedItem = passedItem?.id === id ? passedItem : null;
  const localItem = items.find((i) => i.id === id);
  const isExternalApiRoute = typeof id === "string" && id.startsWith("api-");
  const externalProductId = isExternalApiRoute ? Number(id.slice(4)) : NaN;
  const hasValidExternalProductId = Number.isInteger(externalProductId) && externalProductId > 0;
  const matchingExternalRequest = externalRequest?.id === id ? externalRequest : null;
  const externalItem = matchingExternalRequest?.item;
  const externalItemError = matchingPassedItem || localItem
    ? null
    : hasValidExternalProductId
    ? matchingExternalRequest?.error
    : isExternalApiRoute
      ? "ID produk dari External API tidak valid."
      : null;
  const externalItemLoading =
    !matchingPassedItem &&
    !localItem &&
    isExternalApiRoute &&
    hasValidExternalProductId &&
    matchingExternalRequest === null;
  const item = matchingPassedItem ?? localItem ?? externalItem;

  // Modul 3: Mengambil detail dari External API untuk produk yang berasal dari katalog API.
  useEffect(() => {
    if (matchingPassedItem || localItem || !isExternalApiRoute || !hasValidExternalProductId) return;

    let isActive = true;
    fetchExternalRentalItem(externalProductId)
      .then((result) => {
        if (isActive) setExternalRequest({ id, item: result });
      })
      .catch((error: unknown) => {
        if (isActive) {
          setExternalRequest({
            id,
            error: error instanceof Error ? error.message : "Gagal mengambil detail produk.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [id, matchingPassedItem, localItem, isExternalApiRoute, hasValidExternalProductId, externalProductId]);

  // Modul 2: useEffect untuk side effect saat state rentalDays berubah
  useEffect(() => {
    // Modul 2: router.setParams untuk mengubah parameter URL aktif tanpa pindah halaman
    router.setParams({ days: String(rentalDays) });
  }, [rentalDays, router]);

  // Modul 2: useMemo untuk memoize hasil perhitungan harga
  const totalPrice = useMemo(() => {
    if (!item) return 0;
    return item.pricePerDay * rentalDays;
  }, [item, rentalDays]);

  // Modul 2: canGoBack() & back() untuk navigasi aman
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); // Modul 2: replace fallback
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: externalItemLoading ? "Memuat Produk" : "Tidak Ditemukan", headerShown: true }} />
        <View style={styles.empty}>
          <Ionicons
            name={externalItemLoading ? "cloud-download-outline" : "alert-circle-outline"}
            size={40}
            color={colors.muted}
          />
          <Text style={styles.emptyText}>
            {externalItemLoading ? "Mengambil produk dari External API..." : externalItemError ?? "Barang tidak ditemukan"}
          </Text>
          <Pressable style={[styles.bannerBtn, { marginTop: 12 }]} onPress={handleGoBack}>
            <Text style={styles.bannerBtnText}>Kembali ke Beranda</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategory(item.categoryId);

  const handleChangeDays = (delta: number) => {
    adjustCountRef.current += 1;
    setRentalDays((prev) => Math.max(1, prev + delta));
  };

  const handleConfirmRent = () => {
    addOrder(createRentalOrder(item, category?.name ?? "Kategori lainnya", rentalDays));
    Alert.alert(
      "Sewa Berhasil",
      `${item.name} berhasil ditambahkan ke Sewa Saya.\nDurasi: ${rentalDays} hari\nTotal estimasi: ${formatRupiah(totalPrice)}`,
      [
        {
          text: "Lihat Sewa Saya",
          onPress: () => router.replace("/(tabs)/sewa-saya"),
        },
        { text: "Nanti", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Modul 2: Stack.Screen kustomisasi header dinamis */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: item.name,
          headerLeft: () => (
            <Pressable onPress={handleGoBack} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#ef4444" : colors.text}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.wrapper} contentContainerStyle={styles.listContent}>
        <Image
          source={{ uri: item.imageUrl ?? `https://picsum.photos/seed/${item.imageSeed}/600/400` }}
          style={[styles.cardImage, { height: 240, borderRadius: 16, marginTop: 12 }]}
        />

        <View style={{ marginTop: 16, gap: 6 }}>
          <Text style={styles.nearCategory}>{category?.name.toUpperCase()}</Text>
          <Text style={styles.greeting}>{item.name}</Text>
          <Text style={styles.nearSub}>
            {item.distanceKm !== undefined && item.area
              ? `${formatDistance(item.distanceKm)} • ${item.area} • `
              : ""}
            ★ {item.rating.toFixed(1)}
          </Text>
          <Text style={[styles.price, { fontSize: 20, marginTop: 4 }]}>
            {formatRupiah(item.pricePerDay)}
            <Text style={styles.priceUnit}>/hari</Text>
          </Text>
        </View>

        <View style={styles.durationCard}>
          <View style={styles.durationInfo}>
            <Text style={styles.nearName}>Durasi Sewa</Text>
            <Text style={styles.nearSub}>Atur durasi sewa yang kamu butuhkan</Text>
          </View>

          <View style={styles.durationControls}>
            <Pressable
              style={styles.durationControlButton}
              onPress={() => handleChangeDays(-1)}
              accessibilityRole="button"
              accessibilityLabel="Kurangi durasi sewa"
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>
            <Text style={styles.durationValue}>{rentalDays} Hari</Text>
            <Pressable
              style={styles.durationControlButton}
              onPress={() => handleChangeDays(1)}
              accessibilityRole="button"
              accessibilityLabel="Tambah durasi sewa"
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.guarantee, { marginTop: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nearSub}>Total Estimasi Biaya (useMemo)</Text>
            <Text style={[styles.price, { fontSize: 18 }]}>{formatRupiah(totalPrice)}</Text>
          </View>
          <Pressable style={styles.ctaBtn} onPress={handleConfirmRent}>
            <Text style={styles.ctaBtnText}>Konfirmasi Sewa</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}