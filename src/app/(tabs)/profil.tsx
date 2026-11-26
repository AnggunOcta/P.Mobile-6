import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/styles";

export default function Profil() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const doLogout = async () => {
      try {
        await signOut();
        router.replace("/(auth)/login");
      } catch (err) {
        console.warn("Logout error:", err);
      }
    };

    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" ? window.confirm("Apakah Anda yakin ingin keluar dari akun Anda?") : true;
      if (confirmed) {
        await doLogout();
      }
    } else {
      Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari akun Anda?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: doLogout,
        },
      ]);
    }
  };

  const displayName = user?.user_metadata?.full_name || "Pengguna Sewakuy";
  const email = user?.email || "-";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Info Session */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detail Sesi & Keamanan</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="finger-print" size={20} color={colors.primary} />
              <Text style={styles.rowLabel}>User ID (UUID)</Text>
            </View>
            <Text style={styles.rowValue} numberOfLines={1}>
              {user?.id ? `${user.id.slice(0, 16)}...` : "-"}
            </Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed" size={20} color={colors.primary} />
              <Text style={styles.rowLabel}>Penyimpanan Token</Text>
            </View>
            <Text style={styles.rowValue}>Expo SecureStore</Text>
          </View>
        </View>

        {/* Action Button: Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#b91c1c" />
          <Text style={styles.logoutBtnText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fde8c4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  rowValue: {
    fontSize: 13,
    color: colors.muted,
    maxWidth: 180,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#b91c1c",
  },
});
