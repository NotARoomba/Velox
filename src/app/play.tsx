import { router } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Games } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Play() {
  return (
    <View className="h-full bg-transparent flex">
      <Image
        className="flex h-48 aspect-video mx-auto mt-12"
        resizeMode="contain"
        source={require("@/assets/images/play.png")}
      />
      <View className="flex flex-col gap-y-8">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.APPROXIMATION },
            })
          }
          className="w-5/6 bg-platinum/10 h-32 rounded-2xl mx-auto p-0 flex"
        >
          <View className="flex flex-col my-auto">
            <Text className="text-platinum font-bold text-center text-4xl">
              Approximation
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
          className="w-5/6 bg-platinum/10 h-32 rounded-2xl mx-auto p-0 flex"
        >
          <View className="flex flex-col my-auto">
            <Text className="text-platinum font-bold text-center text-4xl">
              Match
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
          className="w-5/6 bg-platinum/10 h-32 rounded-2xl mx-auto p-0 flex"
        >
          <View className="flex flex-col my-auto">
            <Text className="text-platinum font-bold text-center text-4xl">
              Round the Circle (PI)
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="absolute top-4 left-4"
      >
        <TouchableOpacity onPress={router.back}>
          <Ionicons color="#e8e8e8" size={40} name="arrow-back" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
