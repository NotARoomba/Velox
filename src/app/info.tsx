import Animated, { FadeIn } from "react-native-reanimated";
import { Text, View } from "react-native";
import { useEffect } from "react";
import HolographicText from "../components/HolographicText";

export default function Info() {
  useEffect(() => {
    console.log("Info");
  }, []);
  return (
    <View
      //   entering={FadeIn.duration(1000)}
      className="flex bg-night h-full w-full items-center justify-center"
    >
      <HolographicText className="mx-auto">Hel</HolographicText>
    </View>
  );
}
