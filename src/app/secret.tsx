import { Animated, Platform, Text, TouchableOpacity } from "react-native";
import useFade from "../hooks/useFade";
import { Image } from "expo-image";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
      <ReAnimated.View
        entering={FadeIn}
        exiting={FadeOut}
        className={
          "absolute  left-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <TouchableOpacity onPress={router.back}>
          <Ionicons color={"#e8e8e8"} size={40} name="arrow-back" />
        </TouchableOpacity>
      </ReAnimated.View>
    </Animated.View>
  );
}
