import "react-native-gesture-handler";
import AnimatedAppLoader from "../components/SplashScreen";
import "@/global.css";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import Auth from "./auth";
import { Stack } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { SessionProvider } from "../hooks/useSession";
import Letters from "../components/Letters";
import { useLanguageUpdater } from "../utils/i18n";
import { LoadingProvider } from "../hooks/useLoading";
import Loading from "../components/Loading";

export default function RootLayout() {
  if (Platform.OS == "android") useLanguageUpdater();
  return (
    <AnimatedAppLoader>
      <LoadingProvider>
        <SessionProvider>
          <View className="h-full bg-tranparent">
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: "transparent",
                },
                headerTransparent: false,
                headerShown: false,
                animation: "default",
                // animation: "fade",
                animationDuration: 2000,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name={"auth"} />
              <Stack.Screen name={"profile"} />
              <Stack.Screen name={"play"} />
              <Stack.Screen name={"leaderboard"} />
              <Stack.Screen name={"difficulty"} />
              <Stack.Screen name={"games/pi"} />
              <Stack.Screen name={"games/approximation"} />
              <Stack.Screen name={"games/match"} />
            </Stack>
            <Letters />
            <Loading />
          </View>
        </SessionProvider>
      </LoadingProvider>
    </AnimatedAppLoader>
  );
}
