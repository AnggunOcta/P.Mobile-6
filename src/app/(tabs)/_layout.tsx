import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors } from "../../theme/styles";

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const tabs: TabConfig[] = [
  { name: "index", title: "Beranda", icon: "home-outline", iconActive: "home" },
  { name: "explore", title: "Kategori", icon: "grid-outline", iconActive: "grid" },
  { name: "sewa-saya", title: "Sewa Saya", icon: "receipt-outline", iconActive: "receipt" },
  { name: "disukai", title: "Disukai", icon: "heart-outline", iconActive: "heart" },
  { name: "profil", title: "Profil", icon: "person-outline", iconActive: "person" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, backgroundColor: "#fff" },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={size}
                color={typeof color === "number" ? colors.text : color ?? colors.text}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
