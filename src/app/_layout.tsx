import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="camera"
          options={{
            headerShown: false,
            animation: "ios",
            animationDuration: 1500,
          }}
        />
        <Stack.Screen
          name="cameraSendPhoto"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="contentView"
          options={{
            headerShown: true,
            title: "",
            animation: "ios",
            contentStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            headerTransparent: true,
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
