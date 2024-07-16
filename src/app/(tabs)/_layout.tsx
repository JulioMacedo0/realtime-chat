import { Tabs } from "expo-router";
import React from "react";

import { IconApp } from "@/components/IconApp/IconApp";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].tabBarBackground,
            },
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            },
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Real time chat",
              headerTitleAlign: "center",
              tabBarIcon: ({ color, focused }) => (
                <IconApp
                  lib="Ionicons"
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color, focused }) => (
                <IconApp
                  lib="Ionicons"
                  name={focused ? "code-slash" : "code-slash-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="todo"
            options={{
              title: "todo",
              headerTitleAlign: "center",
              tabBarIcon: ({ color, focused }) => (
                <IconApp
                  lib="Ionicons"
                  name={focused ? "book" : "book-outline"}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
