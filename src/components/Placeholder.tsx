import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, styles } from "../theme/styles";

interface Props {
  title: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Placeholder({ title, desc, icon }: Props) {
  return (
    <SafeAreaView style={[styles.safe, styles.centerScreen]}>
      <Ionicons name={icon} size={56} color={colors.primary} />
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDesc}>{desc}</Text>
    </SafeAreaView>
  );
}
