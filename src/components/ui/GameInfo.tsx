import { View, Platform, Text } from "react-native";
import Lives from "./Lives";
import { GameInfoProps } from "../../utils/types";
import { useTranslation } from "react-i18next";

export default function GameInfo({ lives, timeLeft, guessed }: GameInfoProps) {
  const { t } = useTranslation();
  return (
    <>
      <View
        className={
          "absolute  left-4 " +
          (timeLeft
            ? Platform.OS === "android"
              ? " top-4"
              : "top-16"
            : "bottom-6")
        }
      >
        <Lives lives={lives} />
      </View>
      <View
        className={
          "absolute  right-4 " +
          (timeLeft
            ? Platform.OS === "android"
              ? " top-4"
              : "top-16"
            : "bottom-6")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold">
          {timeLeft ?? t("multiplayer.opponent")}
        </Text>
      </View>
      <View
        className={
          "absolute left-1/2 -translate-x-1/2 " +
          (timeLeft
            ? Platform.OS === "android"
              ? " top-4"
              : "top-16"
            : "bottom-6")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold">
          {guessed}
        </Text>
      </View>
    </>
  );
}
