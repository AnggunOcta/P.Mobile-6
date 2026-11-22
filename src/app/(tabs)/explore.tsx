import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { categories, items, formatRupiah } from "../../constants/data";
import { styles } from "../../theme/styles";

// Halaman Kategori: semua kategori + daftar barangnya
export default function Explore() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.wrapper} contentContainerStyle={styles.listContent}>
        <Text style={[styles.greeting, { marginTop: 12 }]}>Kategori Barang</Text>
        <Text style={styles.subGreeting}>Semua barang yang bisa kamu sewa</Text>

        {categories.map((cat) => {
          const list = items.filter((i) => i.categoryId === cat.id);
          return (
            <View key={cat.id}>
              <View style={[styles.sectionHeader, { justifyContent: "flex-start", gap: 10 }]}>
                <View style={[styles.popCircle, { width: 40, height: 40, borderRadius: 20, backgroundColor: cat.bg }]}>
                  <MaterialCommunityIcons name={cat.icon} size={22} color={cat.id === "elektronik" ? "#fff" : cat.color} />
                </View>
                <Text style={styles.sectionTitle}>
                  {cat.name} ({list.length})
                </Text>
              </View>

              {list.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.nearCard}
                  onPress={() =>
                    router.push({
                      pathname: "/item/[id]",
                      params: { id: item.id, item: JSON.stringify(item) },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Lihat detail ${item.name}`}
                >
                  <Image
                    source={{ uri: item.imageUrl ?? `https://picsum.photos/seed/${item.imageSeed}/200/200` }}
                    style={[styles.nearImage, { width: 56, height: 56 }]}
                  />
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={styles.nearName}>{item.name}</Text>
                    <Text style={styles.nearSub}>
                      {item.area ? `${item.area} • ` : ""}★ {item.rating.toFixed(1)}
                    </Text>
                  </View>
                  <Text style={[styles.price, { alignSelf: "center" }]}>
                    {formatRupiah(item.pricePerDay)}
                    <Text style={styles.priceUnit}>/hari</Text>
                  </Text>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
