import { View, Platform, Text } from "react-native";
import Lives from "./Lives";
import { GameInfoProps } from "../../utils/types";

export default function GameInfo({ lives, timeLeft, guessed }: GameInfoProps) {
  return (
    <>
      <View
        className={
          "absolute  left-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Lives lives={lives} />
      </View>
      <View
        className={
          "absolute  right-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold">
          {timeLeft}
        </Text>
      </View>
      <View
        className={
          "absolute left-1/2 -translate-x-1/2 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold">
          {guessed}
        </Text>
      </View>
    </>
  );
}
