import { Stack } from "expo-router";
import { RentalProvider } from "../context/RentalContext";

export default function RootLayout() {
  return (
    <RentalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
      </Stack>
    </RentalProvider>
  );
}
