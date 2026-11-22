import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ItemCard from "../../components/ItemCard";
import {
  BrowseCategoryId,
  categoryFallbackItems,
  getItemBrowseCategory,
} from "../../constants/categoryCatalog";
import {
  formatDistance,
  formatRupiah,
  getCategory,
  items,
} from "../../constants/data";
import { fetchExternalRentalItems } from "../../constants/externalApi";
import { RentalItem } from "../../constants/types";
import { colors, styles } from "../../theme/styles";

// Custom function: judul section yang bisa dipakai ulang
const renderSectionHeader = (title: string, link?: string) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {link ? <Text style={styles.sectionLink}>{link}</Text> : null}
  </View>
);

type CategoryFilter = BrowseCategoryId | "semua";

type BrowseCategory = {
  id: CategoryFilter;
  label: string;
  emoji: string;
  backgroundColor: string;
};

type Recommendation =
  | "Rekomendasi"
  | "Harga terendah"
  | "Harga tertinggi"
  | "Rating tertinggi";
type LocationFilter = "Semua lokasi" | "Jakarta Selatan" | "Jakarta Pusat";

const locationAreas: Record<
  Exclude<LocationFilter, "Semua lokasi">,
  string[]
> = {
  "Jakarta Selatan": [
    "tebet",
    "cilandak",
    "jagakarsa",
    "kemang",
    "pasar minggu",
  ],
  "Jakarta Pusat": ["menteng"],
};

const featuredCategories: BrowseCategory[] = [
  {
    id: "outdoor",
    label: "Outdoor & Camping",
    emoji: "🏕️",
    backgroundColor: "#e5f7e9",
  },
  {
    id: "fashion",
    label: "Fashion & Kostum",
    emoji: "👗",
    backgroundColor: "#f2eaff",
  },
  {
    id: "elektronik",
    label: "Elektronik",
    emoji: "💻",
    backgroundColor: "#e8edff",
  },
];

const modalCategories: BrowseCategory[] = [
  ...featuredCategories,
  {
    id: "kamera",
    label: "Kamera & Fotografi",
    emoji: "📸",
    backgroundColor: "#e8f2ff",
  },
  {
    id: "hiburan",
    label: "Mainan & Hiburan",
    emoji: "🎮",
    backgroundColor: "#f3eaff",
  },
  {
    id: "acara",
    label: "Event & Pesta",
    emoji: "🎉",
    backgroundColor: "#fff2dd",
  },
  {
    id: "perkakas",
    label: "Alat & Perkakas",
    emoji: "🛠️",
    backgroundColor: "#ffefe2",
  },
  { id: "bayi", label: "Bayi & Anak", emoji: "🧸", backgroundColor: "#ffeaf1" },
];

function matchesCategory(item: RentalItem, category: CategoryFilter): boolean {
  return category === "semua" || getItemBrowseCategory(item) === category;
}

export default function Index() {
  const router = useRouter();
  const [selected, setSelected] = useState<CategoryFilter>("semua");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFilter>("Semua lokasi");
  const [recommendation, setRecommendation] =
    useState<Recommendation>("Rekomendasi");
  const [catalogItems, setCatalogItems] = useState<RentalItem[]>(items);
  const [apiState, setApiState] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [apiError, setApiError] = useState<string | null>(null);

  // Modul 3: Mengambil katalog External API saat halaman dibuka dan menyimpannya sebagai object RentalItem.
  const loadExternalItems = useCallback(() => fetchExternalRentalItems(), []);
  const handleExternalItemsLoaded = useCallback(
    (externalItems: RentalItem[]) => {
      setCatalogItems(externalItems);
      setApiError(null);
      setApiState("success");
    },
    [],
  );
  const handleExternalItemsError = useCallback((error: unknown) => {
    setApiError(
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat mengambil data API.",
    );
    setApiState("error");
  }, []);

  useEffect(() => {
    let isActive = true;
    loadExternalItems() //promise
      .then((externalItems) => { // then Callback: dijalankan saat data berhasil diterima
        if (isActive) handleExternalItemsLoaded(externalItems);
      })
      .catch((error: unknown) => {
        if (isActive) handleExternalItemsError(error);
      });

    return () => {
      isActive = false;
    };
  }, [loadExternalItems, handleExternalItemsLoaded, handleExternalItemsError]);

  const retryExternalItems = () => {
    setApiState("loading");
    setApiError(null);
    loadExternalItems()
      .then(handleExternalItemsLoaded)
      .catch(handleExternalItemsError);
  };

  const browseItems = useMemo(() => {
    const uniqueItems = new Map<string, RentalItem>();
    [...catalogItems, ...items, ...categoryFallbackItems].forEach((item) => {
      uniqueItems.set(item.id, item);
    });
    return [...uniqueItems.values()];
  }, [catalogItems]);
  //synchronous programming
  const filtered: RentalItem[] = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const result = browseItems.filter((item) => {
      const matchesLocation =
        selectedLocation === "Semua lokasi" ||
        item.area === undefined ||
        locationAreas[selectedLocation].includes(item.area.toLowerCase());

      return (
        matchesCategory(item, selected) &&
        item.name.toLowerCase().includes(keyword) &&
        matchesLocation
      );
    });

    if (recommendation === "Harga terendah") {
      return result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    }
    if (recommendation === "Harga tertinggi") {
      return result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }
    if (recommendation === "Rating tertinggi") {
      return result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [browseItems, selected, query, selectedLocation, recommendation]);
  const selectedCategoryLabel =
    selected === "semua"
      ? "Semua Produk"
      : (modalCategories.find((category) => category.id === selected)?.label ??
        "Kategori");

  const chooseLocation = () => {
    Alert.alert(
      "Pilih Lokasi",
      "Filter produk berdasarkan area yang tersedia.",
      [
        {
          text: "Semua lokasi",
          onPress: () => setSelectedLocation("Semua lokasi"),
        },
        {
          text: "Jakarta Selatan",
          onPress: () => setSelectedLocation("Jakarta Selatan"),
        },
        {
          text: "Jakarta Pusat",
          onPress: () => setSelectedLocation("Jakarta Pusat"),
        },
      ],
    );
  };

  const chooseRecommendation = () => {
    Alert.alert("Urutkan Produk", "Pilih cara menampilkan produk.", [
      { text: "Rekomendasi", onPress: () => setRecommendation("Rekomendasi") },
      {
        text: "Harga terendah",
        onPress: () => setRecommendation("Harga terendah"),
      },
      {
        text: "Rating tertinggi",
        onPress: () => setRecommendation("Rating tertinggi"),
      },
    ]);
  };

  // 2 barang terdekat
  const nearby: RentalItem[] = [...items]
    .sort(
      (a, b) =>
        (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE),
    )
    .slice(0, 2);

  const header = (
    <View>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>Halo! 👋</Text>
          <Text style={styles.subGreeting}>Mau sewa barang apa hari ini?</Text>
        </View>
        <View style={styles.savePill}>
          <Ionicons name="leaf" size={14} color={colors.primary} />
          <Text style={styles.savePillText}>Hemat 68%</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kamera, tenda, gaun, HT..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() => Alert.alert("Filter", "Fitur filter segera hadir")}
        >
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.categoryCard}>
        {featuredCategories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.featuredCategory}
            onPress={() => setSelected(category.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === category.id }}
          >
            <View
              style={[
                styles.featuredCategoryIcon,
                { backgroundColor: category.backgroundColor },
              ]}
            >
              <Text style={styles.featuredCategoryEmoji} accessible={false}>
                {category.emoji}
              </Text>
            </View>
            <Text style={styles.featuredCategoryLabel} numberOfLines={2}>
              {category.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.featuredCategory}
          onPress={() => setCategoryModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Pilih semua kategori"
        >
          <View
            style={[
              styles.featuredCategoryIcon,
              { backgroundColor: "#fff3dc" },
            ]}
          >
            <Text style={styles.featuredCategoryEmoji} accessible={false}>
              🛍️
            </Text>
          </View>
          <Text style={styles.featuredCategoryLabel} numberOfLines={2}>
            Semua
          </Text>
        </Pressable>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTag}>SPESIAL AKHIR PEKAN</Text>
          <Text style={styles.bannerTitle}>Hemat hingga 40%</Text>
          <Text style={styles.bannerDesc}>
            Ratusan gadget, outdoor, dan perlengkapan acara siap disewa.
          </Text>
          <Pressable
            style={styles.bannerBtn}
            onPress={() => setSelected("semua")}
          >
            <Text style={styles.bannerBtnText}>Sewa Sekarang</Text>
            <Ionicons name="arrow-forward" size={16} color="#3b2300" />
          </Pressable>
        </View>
        <Image
          source={{ uri: "https://picsum.photos/seed/sewakuy-promo/200/200" }}
          style={styles.bannerImg}
        />
      </View>

      <View style={styles.homeFilters}>
        <Pressable
          style={styles.homeFilterButton}
          onPress={chooseLocation}
          accessibilityRole="button"
          accessibilityLabel={`Lokasi: ${selectedLocation}`}
        >
          <View style={styles.homeFilterTextGroup}>
            <Text style={styles.homeFilterCaption}>Lokasi</Text>
            <Text style={styles.homeFilterValue} numberOfLines={1}>
              {selectedLocation}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </Pressable>
        <Pressable
          style={styles.homeFilterButton}
          onPress={chooseRecommendation}
          accessibilityRole="button"
          accessibilityLabel={`Urutan: ${recommendation}`}
        >
          <View style={styles.homeFilterTextGroup}>
            <Text style={styles.homeFilterCaption}>Urutkan</Text>
            <Text style={styles.homeFilterValue} numberOfLines={1}>
              {recommendation}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </Pressable>
      </View>

      {/* Jaminan */}
      <View style={styles.guarantee}>
        <View style={styles.guaranteeIcon}>
          <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.guaranteeTitle}>
            Jaminan Sewakuy Proteksi 100%
          </Text>
          <Text style={styles.guaranteeDesc}>
            Semua barang terlindungi deposit aman & verifikasi KTP.
          </Text>
        </View>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={colors.muted}
        />
      </View>

      {/* Judul list */}
      {renderSectionHeader(selectedCategoryLabel, `${filtered.length} produk`)}
    </View>
  );

  const footer = (
    <View>
      {renderSectionHeader("Dekat Lokasimu", "Peta")}
      {nearby.map((item) => (
        <View key={item.id} style={styles.nearCard}>
          <Image
            source={{
              uri: `https://picsum.photos/seed/${item.imageSeed}/200/200`,
            }}
            style={styles.nearImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.nearCategory}>
              {getCategory(item.categoryId)?.name.toUpperCase()}
            </Text>
            <Text style={styles.nearName}>{item.name}</Text>
            <Text style={styles.nearSub}>
              {item.distanceKm !== undefined && item.area
                ? `${formatDistance(item.distanceKm)} • ${item.area}`
                : (item.area ?? "Lokasi tidak tersedia")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Text style={styles.price}>
                {formatRupiah(item.pricePerDay)}
                <Text style={styles.priceUnit}>/hari</Text>
              </Text>
              <Pressable
                style={styles.nearBtn}
                onPress={() => Alert.alert("Chat", `Chat pemilik ${item.name}`)}
              >
                <Text style={styles.nearBtnText}>Chat & Sewa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.cta}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>Punya barang jarang terpakai?</Text>
          <Text style={styles.ctaDesc}>
            Sewakan ke tetangga terdekat & hasilkan pasif income.
          </Text>
        </View>
        <Pressable
          style={styles.ctaBtn}
          onPress={() => Alert.alert("Mulai Sewakan", "Fitur segera hadir")}
        >
          <Text style={styles.ctaBtnText}>Mulai Sewakan</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.categoryModalRoot}>
          <Pressable
            style={styles.categoryModalBackdrop}
            onPress={() => setCategoryModalVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Tutup pilihan kategori"
          />
          <View style={styles.categoryModalSheet}>
            <View style={styles.categoryModalHeader}>
              <View style={styles.categoryModalHeading}>
                <Text style={styles.categoryModalTitle}>
                  Pilih Kategori Rental
                </Text>
                <Text style={styles.categoryModalSubtitle}>
                  Temukan barang & perlengkapan sesuai kebutuhanmu
                </Text>
              </View>
              <Pressable
                style={styles.categoryModalClose}
                onPress={() => setCategoryModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Tutup"
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <View style={styles.categoryGrid}>
              {modalCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={styles.categoryGridItem}
                  onPress={() => {
                    setSelected(category.id);
                    setCategoryModalVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selected === category.id }}
                >
                  <View
                    style={[
                      styles.categoryGridIcon,
                      { backgroundColor: category.backgroundColor },
                    ]}
                  >
                    <Text style={styles.categoryGridEmoji} accessible={false}>
                      {category.emoji}
                    </Text>
                  </View>
                  <Text style={styles.categoryGridLabel}>{category.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image
              source={require("../../../assets/images/sewakuy-logo.png")}
              style={styles.homeLogo}
              resizeMode="contain"
              accessibilityLabel="Logo Sewakuy"
            />
            <Pressable
              style={styles.locationRow}
              onPress={() => Alert.alert("Lokasi", "Pilih lokasi segera hadir")}
            >
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={styles.locationText}>Jakarta Selatan</Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.headerRight}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <Ionicons name="chatbox-outline" size={24} color={colors.text} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>F</Text>
            </View>
          </View>
        </View>

        {apiState !== "success" ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            {apiState === "loading" ? (
              <Text style={styles.cardMetaText}>
                Mengambil katalog dari External API...
              </Text>
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={[styles.cardMetaText, { flex: 1 }]}>
                  {apiError} Menampilkan katalog lokal.
                </Text>
                <Pressable
                  onPress={retryExternalItems}
                  accessibilityRole="button"
                >
                  <Text style={styles.sectionLink}>Coba lagi</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={colors.muted} />
              <Text style={styles.emptyText}>
                {selected === "semua"
                  ? "Barang tidak ditemukan."
                  : `Belum ada produk untuk kategori ${selectedCategoryLabel}.`}
              </Text>
            </View>
          }
          renderItem={({ item }) => <ItemCard item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}
