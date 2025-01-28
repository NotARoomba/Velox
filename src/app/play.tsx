import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Games } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import useFade from "../hooks/useFade";
import { useSettings } from "../hooks/useSettings";
import HoloText from "../components/effects/HoloText";
import { useTranslation } from "react-i18next";

export default function Play() {
  const opacity = useFade();
  const { theme } = useSettings();
  const { t } = useTranslation();
  return (
    <Animated.View
      style={{ opacity }}
      className="h-full bg-transparent flex pt-12"
    >
      <HoloText
        fontSize={128}
        width={Dimensions.get("window").width}
        height={200}
      >
        {t("titles.play")}
      </HoloText>
      <View className="flex flex-col gap-y-8 -translate-y-8">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.APPROXIMATION },
            })
          }
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          className="w-5/6 dark:bg-platinum/10 bg-night/5 bg-cy h-32 rounded-2xl mx-auto p-0 flex "
        >
          <View className="flex flex-col my-auto">
            <Text className="dark:text-platinum text-night font-bold text-center text-4xl">
              {t("games.approximation.title")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.MATCH },
            })
          }
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          className="w-5/6 dark:bg-platinum/10 bg-night/5 bg-cy h-32 rounded-2xl mx-auto p-0 flex "
        >
          <View className="flex flex-col my-auto">
            <Text className="dark:text-platinum text-night font-bold text-center text-4xl">
              {t("buttons.match")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.PI },
            })
          }
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          className="w-5/6 dark:bg-platinum/10 bg-night/5 h-32 rounded-2xl mx-auto p-0 flex"
        >
          <View className="flex flex-col my-auto">
            <Text className="dark:text-platinum text-night font-bold text-center text-4xl">
              {t("games.round.title")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ReAnimated.View
        entering={FadeIn}
        exiting={FadeOut}
        className={
          "absolute  left-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <TouchableOpacity onPress={router.back}>
          <Ionicons
            color={theme === "dark" ? "#e8e8e8" : "#151515"}
            size={40}
            name="arrow-back"
          />
        </TouchableOpacity>
      </ReAnimated.View>
    </Animated.View>
  );
}
