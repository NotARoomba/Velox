import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Animated } from "react-native";
import { Difficulty } from "../utils/types";
import Slider from "../components/Slider";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import useFade from "../hooks/useFade";

export default function DifficultySelect() {
  const params = useLocalSearchParams();
  const [difficulty, setDifficulty] = useState<string>(Difficulty.EASY);
  const opacity = useFade();

  return (
    <Animated.View style={{ opacity }} className="h-full bg-transparent flex">
      <View className="m-auto">
        <Text className="text-platinum m-auto font-bold text-4xl text-center mb-4">
          Select Difficulty
        </Text>
        <Slider
          options={["Easy", "Medium", "Hard"]}
          setOption={setDifficulty}
          selected={difficulty}
        />
        <TouchableOpacity
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
          <Text className="text-platinum m-auto font-bold text-center text-2xl">
            Start
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
          <Ionicons color="#e8e8e8" size={40} name="arrow-back" />
        </TouchableOpacity>
      </ReAnimated.View>
    </Animated.View>
  );
}
