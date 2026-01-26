import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme, View, ActivityIndicator } from "react-native";
import { Observer } from "mobx-react-lite";
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import themeStore from "../src/stores/ThemeStore";
import { fontAssets } from "../src/theme";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync(fontAssets);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }
  
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
