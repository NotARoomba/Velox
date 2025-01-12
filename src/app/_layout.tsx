import "react-native-gesture-handler";
import AnimatedAppLoader from "../components/SplashScreen";
import "@/global.css";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Index from ".";
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
              headerShown: true,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        ) : (
          <Index />
        )}
      </View>
    </AnimatedAppLoader>
  );
}
