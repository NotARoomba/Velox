import { Animated, Platform, Text, TouchableOpacity } from "react-native";
import useFade from "../hooks/useFade";
import { Image } from "expo-image";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BackButton from "../components/buttons/BackButton";

export default function Secret() {
  const opacity = useFade();
  return (
    <Animated.View style={{ opacity }} className="h-full w-full flex">
      <ReAnimated.Image
        entering={FadeIn.duration(5000).delay(300)}
        style={{ height: "100%", width: "100%", objectFit: "fill" }}
        source={require("@/assets/images/makinator.png")}
      />
      <ReAnimated.View
        entering={FadeIn.duration(5000).delay(300)}
        className=" absolute bottom-6 bg-platinum p-4 w-10/12 left-1/2 rounded-2xl -translate-x-[50%]"
      >
        <Text className=" text-celtic_blue font-bold  text-center text-2xl w-full mx-auto">
          Gracias por todo, Mr. Charris
        </Text>
      </ReAnimated.View>
      <BackButton />
    </Animated.View>
  );
}
