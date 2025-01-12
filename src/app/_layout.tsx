import "react-native-gesture-handler";
import AnimatedAppLoader from "../components/SplashScreen";
import "@/global.css";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Auth from "./auth";
import { Stack } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Session changed");
      setSession(session);
    });
  }, []);
  return (
    <AnimatedAppLoader>
      <View className="flex bg-night text-platinum h-full">
        {session && session.user ? (
          <Stack
            screenOptions={{
              headerTransparent: false,
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        ) : (
          <Auth />
        )}
      </View>
    </AnimatedAppLoader>
  );
}
