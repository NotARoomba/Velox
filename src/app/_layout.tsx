import "react-native-gesture-handler";
import AnimatedAppLoader from "../components/SplashScreen";
import "@/global.css";
import { useState } from "react";
import { Text, View } from "react-native";
import Index from ".";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <AnimatedAppLoader>
      <View className="flex bg-night text-platinum h-full">
        {!isLoggedIn ? (
          <Index />
        ) : (
          <Stack
            screenOptions={{
              headerTransparent: false,
              headerShown: true,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        )}
      </View>
    </AnimatedAppLoader>
  );
}
