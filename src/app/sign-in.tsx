import Animated, { FadeIn } from "react-native-reanimated";
import { Text, View } from "react-native";
import { useEffect } from "react";

export default function SignIn() {
  return (
    <View
      //   entering={FadeIn.duration(1000)}
      className="flex h-full w-full items-center justify-center"
    >
      <Text className="m-auto text-white">SignIN</Text>
    </View>
  );
}
