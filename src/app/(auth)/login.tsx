import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { colors } from "../../theme/styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    setErrorMessage(null);
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage("Silakan isi email dan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // Alur Sign Up (Pendaftaran)
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: name.trim() || cleanEmail.split("@")[0],
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          Alert.alert(
            "Pendaftaran Berhasil",
            "Akun Anda telah dibuat! Silakan masuk dengan akun Anda.",
            [{ text: "OK", onPress: () => setIsRegistering(false) }]
          );
        }
      } else {
        // Alur Sign In (Masuk)
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          setErrorMessage("Email atau kata sandi tidak valid: " + error.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.container}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={authStyles.card}>
          {/* Logo & Title */}
          <View style={authStyles.header}>
            <Image
              source={require("../../../assets/images/sewakuy-splash-logo.png")}
              style={{ width: 180, height: 75, resizeMode: "contain", marginBottom: 6 }}
            />
            <Text style={authStyles.subtitle}>
              {isRegistering
                ? "Daftar akun baru untuk mulai menyewa barang"
                : "Masuk ke akun Anda untuk melanjutkan"}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={authStyles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#b91c1c" />
              <Text style={authStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={authStyles.form}>
            {isRegistering && (
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Nama Lengkap</Text>
                <View style={authStyles.inputRow}>
                  <Ionicons name="person-outline" size={20} color={colors.muted} />
                  <TextInput
                    style={authStyles.input}
                    placeholder="Masukkan nama Anda"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}

            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Alamat Email</Text>
              <View style={authStyles.inputRow}>
                <Ionicons name="mail-outline" size={20} color={colors.muted} />
                <TextInput
                  style={authStyles.input}
                  placeholder="contoh@domain.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Kata Sandi</Text>
              <View style={authStyles.inputRow}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[authStyles.submitBtn, isLoading && authStyles.btnDisabled]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={authStyles.submitBtnText}>
                  {isRegistering ? "Daftar Sekarang" : "Masuk"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Switch Mode */}
            <TouchableOpacity
              style={authStyles.switchBtn}
              onPress={() => {
                setIsRegistering(!isRegistering);
                setErrorMessage(null);
              }}
              disabled={isLoading}
            >
              <Text style={authStyles.switchText}>
                {isRegistering
                  ? "Sudah punya akun? Masuk di sini"
                  : "Belum punya akun? Daftar sekarang"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fde8c4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 8,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#b91c1c",
    fontWeight: "600",
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  switchBtn: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 4,
  },
  switchText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
});
