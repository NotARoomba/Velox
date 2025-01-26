import "react-native-gesture-handler";
import AnimatedAppLoader from "../components/screens/SplashScreen";
import "@/global.css";
import { useEffect } from "react";
import { Platform, StatusBar, Text, useColorScheme, View } from "react-native";
import { Stack } from "expo-router";
import { SessionProvider } from "../hooks/useSession";
import Letters from "../components/effects/Letters";
import { useLanguageUpdater } from "../utils/i18n";
import { LoadingProvider } from "../hooks/useLoading";
import Loading from "../components/screens/Loading";
import { SettingsProvider } from "../hooks/useSettings";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  if (Platform.OS == "android") useLanguageUpdater();
  useEffect(() => {
    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false, // Reanimated runs in strict mode by default
    });
  }, []);

  const colorScheme = useColorScheme();

  return (
    <AnimatedAppLoader>
      <LoadingProvider>
        <SettingsProvider>
          <SessionProvider>
            <View className="h-full bg-tranparent">
              <GestureHandlerRootView>
                <StatusBar
                  className="dark:bg-night bg-platinum dark:text-platinum text-night"
                  barStyle={
                    colorScheme == "light" ? "dark-content" : "light-content"
                  }
                />
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
                  <Stack.Screen name={"settings"} />
                  <Stack.Screen name={"play"} />
                  <Stack.Screen name={"leaderboard"} />
                  <Stack.Screen name={"difficulty"} />
                  <Stack.Screen name={"secret"} />
                  <Stack.Screen name={"games/pi"} />
                  <Stack.Screen name={"games/approximation"} />
                  <Stack.Screen name={"games/match"} />
                </Stack>
                <Letters />
                <Loading />
              </GestureHandlerRootView>
            </View>
          </SessionProvider>
        </SettingsProvider>
      </LoadingProvider>
    </AnimatedAppLoader>
  );
}
