import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Observer } from "mobx-react-lite";
import themeStore from "../src/stores/ThemeStore";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  
  return (
    <SafeAreaProvider>
      <Observer>
        {() => {
          const currentTheme = themeStore.theme === 'system' ? systemColorScheme : themeStore.theme;
          return <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />;
        }}
      </Observer>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
