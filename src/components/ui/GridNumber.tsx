import { MatchNumberProps } from "@/src/utils/types";
import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

export default function GridNumber({
  number,
  selected,
  setSelected,
}: MatchNumberProps) {
  const outlineOffset = useSharedValue(selected === number ? 1 : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    outlineOffset.value = withSpring(selected === number ? 1 : 0, {
      damping: 15,
      stiffness: 250,
    });
  }, [selected]);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500 * (Math.random() * 2),
      easing: Easing.ease,
    });
  }, []);

  const gridStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      borderColor: "#0074d9",
      borderRightWidth: outlineOffset.value * 4,
      borderBottomWidth: outlineOffset.value * 4,
      transform: [
        { translateX: -outlineOffset.value * 2 },
        { translateY: -outlineOffset.value * 2 },
      ],
    };
  });

  return (
    <Animated.View exiting={FadeOut.duration(500)}>
      <Animated.View
        // entering={FadeIn.duration(1000)}
        style={gridStyle}
        className="w-10/12 aspect-square flex rounded-2xl p-2  dark:bg-platinum/10 bg-night/5"
      >
        <Pressable
          onPress={() =>
            setSelected((prev: number) => (prev == number ? -1 : number))
          }
          className="w-full h-full flex flex-wrap m-auto items-center justify-center"
        >
          {Array.from({ length: 100 }, (_, i) => (
            <View
              key={i}
              className={
                "w-[7.5%] aspect-square m-0.5 " +
                (i < number ? "bg-celtic_blue" : "bg-platinum")
              }
            />
          ))}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
