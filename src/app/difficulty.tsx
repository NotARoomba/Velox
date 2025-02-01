import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Animated } from "react-native";
import { Difficulty } from "../utils/types";
import Slider from "../components/buttons/Slider";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import useFade from "../hooks/useFade";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "react-i18next";

export default function DifficultySelect() {
  const params = useLocalSearchParams();
  const [difficulty, setDifficulty] = useState(Difficulty.EASY);
  const opacity = useFade();
  const { theme } = useSettings();
  const { t } = useTranslation();

  return (
    <Animated.View style={{ opacity }} className="h-full bg-transparent flex">
      <View className="m-auto">
        <Text className="dark:text-platinum text-night m-auto font-bold text-4xl text-center mb-4">
          {t("titles.difficulty")}
        </Text>
        <Slider
          options={[
            t("buttons.difficulties.easy"),
            t("buttons.difficulties.medium"),
            t("buttons.difficulties.hard"),
          ]}
          setOption={(v) =>
            setDifficulty(
              v == t("buttons.difficulties.easy")
                ? Difficulty.EASY
                : v == t("buttons.difficulties.medium")
                ? Difficulty.MEDIUM
                : Difficulty.HARD
            )
          }
          selected={
            difficulty == Difficulty.EASY
              ? t("buttons.difficulties.easy")
              : difficulty == Difficulty.MEDIUM
              ? t("buttons.difficulties.medium")
              : t("buttons.difficulties.hard")
          }
        />
        <TouchableOpacity
          testID="start_game_button"
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          onPress={() =>
            router.push({
              pathname: `games/${params.game}` as any,
              params: { difficulty },
            })
          }
          className="bg-platinum/10 rounded-2xl mx-auto py-2 flex w-full mt-4 px-16"
        >
          <Text className="dark:text-platinum text-night m-auto font-bold text-center text-2xl">
            {t("buttons.start")}
          </Text>
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
