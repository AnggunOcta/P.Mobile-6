import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Modul 2: Router untuk navigasi
import { Image, Pressable, Text, View } from "react-native";
import { colors, styles } from "../theme/styles";
import { formatDistance, formatRupiah } from "../constants/data";
import { RentalItem } from "../constants/types";

interface Props {
  item: RentalItem;
}

export default function ItemCard({ item }: Props) {
  const router = useRouter();

  // Modul 2: Navigasi menggunakan router.push() ke Dynamic Route
  const handleOpenDetail = () => {
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id, item: JSON.stringify(item) },
    });
  };

  return (
    <Pressable style={styles.card} onPress={handleOpenDetail}>
      <Image
        source={{ uri: item.imageUrl ?? `https://picsum.photos/seed/${item.imageSeed}/400/300` }}
        style={styles.cardImage}
      />
      <View style={styles.ratingPill}>
        <Ionicons name="star" size={12} color={colors.primary} />
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>

      <View style={styles.cardMeta}>
        <Ionicons name="navigate" size={12} color={colors.primary} />
        <Text style={styles.cardMetaText}>
          {item.distanceKm !== undefined && item.area
            ? `${formatDistance(item.distanceKm)} • ${item.area}`
            : "Data dari External API"}
        </Text>
      </View>
      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>

      {item.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          {formatRupiah(item.pricePerDay)}
          <Text style={styles.priceUnit}>/hari</Text>
        </Text>
        <View style={styles.goBtn}>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={{ transform: [{ rotate: "-45deg" }] }} />
        </View>
      </View>
    </Pressable>
  );
}