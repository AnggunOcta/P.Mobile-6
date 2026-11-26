import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart, CartItem } from "../../context/CartContext";
import { useRentals, createRentalOrder } from "../../context/RentalContext";
import { formatRupiah } from "../../constants/data";
import { colors, styles } from "../../theme/styles";

export default function Keranjang() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { addOrder } = useRentals();
  const router = useRouter();

  const handleCheckoutItem = (cartItem: CartItem) => {
    addOrder(
      createRentalOrder(
        cartItem.item,
        cartItem.categoryName,
        cartItem.durationDays
      )
    );
    removeFromCart(cartItem.id);

    if (Platform.OS === "web") {
      alert(`${cartItem.item.name} berhasil disewa dan masuk ke Pesanan!`);
      router.push("/(tabs)/sewa-saya");
    } else {
      Alert.alert(
        "Sewa Berhasil",
        `${cartItem.item.name} berhasil disewa dan masuk ke Pesanan.`,
        [
          {
            text: "Lihat Pesanan",
            onPress: () => router.push("/(tabs)/sewa-saya"),
          },
          { text: "Tutup", style: "cancel" },
        ]
      );
    }
  };

  const handleCheckoutAll = () => {
    cartItems.forEach((cartItem) => {
      addOrder(
        createRentalOrder(
          cartItem.item,
          cartItem.categoryName,
          cartItem.durationDays
        )
      );
    });
    clearCart();

    if (Platform.OS === "web") {
      alert("Semua barang di keranjang berhasil disewa!");
      router.push("/(tabs)/sewa-saya");
    } else {
      Alert.alert(
        "Sewa Berhasil",
        "Semua barang di keranjang berhasil dipesan.",
        [
          {
            text: "Lihat Pesanan",
            onPress: () => router.push("/(tabs)/sewa-saya"),
          },
          { text: "Tutup", style: "cancel" },
        ]
      );
    }
  };

  const totalAllPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.rentalListContent, { paddingBottom: 110 }]}
        ListHeaderComponent={
          <View style={styles.rentalListHeader}>
            <Text style={styles.greeting}>Keranjang</Text>
            <Text style={styles.subGreeting}>
              {cartItems.length === 0
                ? "Keranjang belanja kamu masih kosong"
                : `${cartItems.length} barang siap disewa`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={colors.muted} />
            <Text style={[styles.nearName, { marginTop: 12 }]}>
              Keranjang Masih Kosong
            </Text>
            <Text style={styles.emptyText}>
              Pilih barang di beranda lalu tekan tombol "+ Keranjang".
            </Text>
          </View>
        }
        renderItem={({ item: cartItem }) => (
          <View style={[styles.rentalOrderCard, { position: "relative" }]}>
            <Image
              source={{
                uri:
                  cartItem.item.imageUrl ??
                  `https://picsum.photos/seed/${cartItem.item.imageSeed}/400/300`,
              }}
              style={styles.rentalOrderImage}
            />
            <View style={styles.rentalOrderDetails}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.nearCategory}>
                  {cartItem.categoryName.toUpperCase()}
                </Text>
                <Pressable
                  onPress={() => removeFromCart(cartItem.id)}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </Pressable>
              </View>

              <Text style={styles.nearName} numberOfLines={2}>
                {cartItem.item.name}
              </Text>
              <Text style={styles.nearSub}>
                {formatRupiah(cartItem.item.pricePerDay)} /hari ×{" "}
                {cartItem.durationDays} hari
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={[styles.price, { fontSize: 16 }]}>
                  {formatRupiah(cartItem.totalPrice)}
                </Text>

                <Pressable
                  style={[styles.ctaBtn, { paddingHorizontal: 14, paddingVertical: 6 }]}
                  onPress={() => handleCheckoutItem(cartItem)}
                >
                  <Text style={[styles.ctaBtnText, { fontSize: 12 }]}>Sewa</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          cartItems.length > 0 ? (
            <View
              style={[
                styles.guarantee,
                { marginTop: 16, alignItems: "center" },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.nearSub}>Total Semua Keranjang</Text>
                <Text style={[styles.price, { fontSize: 18 }]}>
                  {formatRupiah(totalAllPrice)}
                </Text>
              </View>
              <Pressable
                style={[styles.ctaBtn, { paddingHorizontal: 20 }]}
                onPress={handleCheckoutAll}
              >
                <Text style={styles.ctaBtnText}>Sewa Semua</Text>
              </Pressable>
            </View>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}
