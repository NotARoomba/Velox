import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Index() {
  return (
    <Animated.View
      className="bg-night flex h-full w-full"
      entering={FadeIn.duration(2000)}
    >
      <Text className="m-auto text-4xl text-platinum">SAPO</Text>
    </Animated.View>
  );
}
