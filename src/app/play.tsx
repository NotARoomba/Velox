import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Games } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import useFade from "../hooks/useFade";

export default function Play() {
  const opacity = useFade();
  return (
    <Animated.View style={{ opacity }} className="h-full bg-transparent flex">
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
