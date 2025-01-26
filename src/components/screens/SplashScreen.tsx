import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Button,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

import { ReactNode } from "react";

export default function AnimatedAppLoader({
  children,
}: {
  children: ReactNode;
}) {
  return <AnimatedSplashScreen>{children}</AnimatedSplashScreen>;
}

export function AnimatedSplashScreen({ children }: { children: ReactNode }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setAnimationComplete(true));
      }, 5000);
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View className="flex bg-transparent h-full w-full">
      {isSplashAnimationComplete && (
        <SafeAreaView className="dark:bg-night bg-platinum dark:text-platinum text-night" />
      )}
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          style={{
            opacity: animation,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            zIndex: 100,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              zIndex: 100,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <LottieView
              loop={false}
              autoPlay={true}
              style={{
                width: "100%",
                display: "flex",
                height: "100%",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("@/assets/splash.json")}
            />
          </View>

          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "cover",
              opacity: animation,
            }}
            source={require("@/assets/images/splash.png")}
            onLoadEnd={onImageLoaded}
          />
        </Animated.View>
      )}
    </View>
  );
}
