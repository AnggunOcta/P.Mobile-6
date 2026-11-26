import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoriteContext";
import ItemCard from "../../components/ItemCard";
import { colors, styles } from "../../theme/styles";

export default function Disukai() {
  const { favorites } = useFavorites();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={favorites.length > 0 ? styles.gridRow : undefined}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 16, marginTop: 8 }}>
            <Text style={styles.greeting}>Barang Favorit</Text>
            <Text style={styles.subGreeting}>
              {favorites.length === 0
                ? "Daftar barang yang kamu sukai akan tampil di sini"
                : `${favorites.length} barang disukai`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-dislike-outline" size={48} color={colors.muted} />
            <Text style={[styles.nearName, { marginTop: 12 }]}>Belum ada barang favorit</Text>
            <Text style={styles.emptyText}>
              Tekan ikon hati (love) pada detail barang untuk menyimpannya di sini.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </SafeAreaView>
  );
}
