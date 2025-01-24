import { View, ActivityIndicator, Text } from "react-native";
import { useLoading } from "../hooks/useLoading";
import { useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

export default function Loading() {
  const { loading } = useLoading();
  const { theme } = useSettings();
  const { t } = useTranslation();
  return (
    loading && (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="flex-1 absolute h-screen w-screen z-50 bg-night/50  justify-center items-center"
      >
        <ActivityIndicator size="large" color={"#e8e8e8"} />
        <Text className="text-platinum font-bold text-2xl text-center">
          {t("loading")}
        </Text>
      </Animated.View>
    )
  );
}
