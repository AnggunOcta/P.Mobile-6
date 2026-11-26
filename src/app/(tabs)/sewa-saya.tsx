import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRentals } from "../../context/RentalContext";
import { formatRupiah } from "../../constants/data";
import { colors, styles } from "../../theme/styles";

export default function SewaSaya() {
  const { orders, isLoading, refreshOrders } = useRentals();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={[styles.rentalListContent, { paddingBottom: 100 }]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshOrders}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.rentalListHeader}>
            <Text style={styles.greeting}>Sewa Saya</Text>
            <Text style={styles.subGreeting}>
              {orders.length === 1 ? "1 pesanan terkonfirmasi" : `${orders.length} pesanan terkonfirmasi`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={44} color={colors.muted} />
            <Text style={styles.nearName}>Belum ada penyewaan</Text>
            <Text style={styles.emptyText}>Pesanan yang dikonfirmasi di Supabase akan tampil di sini.</Text>
          </View>
        }
        renderItem={({ item: order }) => (
          <View style={styles.rentalOrderCard}>
            <Image
              source={{
                uri: order.imageUrl ?? `https://picsum.photos/seed/${order.imageSeed}/400/300`,
              }}
              style={styles.rentalOrderImage}
            />
            <View style={styles.rentalOrderDetails}>
              <Text style={styles.nearCategory}>{order.categoryName.toUpperCase()}</Text>
              <Text style={styles.nearName} numberOfLines={2}>
                {order.name}
              </Text>
              <Text style={styles.nearSub}>
                {formatRupiah(order.pricePerDay)} /hari × {order.durationDays} hari
              </Text>
              <View style={styles.rentalOrderTotal}>
                <Text style={styles.cardMetaText}>Total estimasi</Text>
                <Text style={styles.price}>{formatRupiah(order.totalPrice)}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
