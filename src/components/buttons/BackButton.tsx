import { useSettings } from "@/src/hooks/useSettings";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function BackButton() {
  const { theme } = useSettings();
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={
        "absolute  left-4 " + (Platform.OS === "android" ? " top-4" : "top-16")
      }
    >
      <TouchableOpacity testID="back_button" onPress={router.back}>
        <Ionicons
          color={theme === "dark" ? "#e8e8e8" : "#151515"}
          size={40}
          name="arrow-back"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
