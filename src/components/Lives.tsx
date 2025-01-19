import React from "react";
import { View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedHeart = ({
  filled,
  animatedStyle,
}: {
  filled: boolean;
  animatedStyle: any;
}) => (
  <Animated.View style={[animatedStyle]}>
    <Octicons
      name={filled ? "heart-fill" : "heart"}
      size={24}
      color={filled ? "red" : "gray"}
    />
  </Animated.View>
);

export default function Lives({
  lives,
  totalLives = 3,
}: {
  lives: number;
  totalLives?: number;
}) {
  const heartAnimations = Array(totalLives)
    .fill(0)
    .map(() => useSharedValue(1)); // Initial scale of 1 for hearts

  const animatedStyles = heartAnimations.map((animation) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(animation.value, { duration: 300 }) }],
      opacity: withTiming(animation.value, { duration: 300 }),
    })),
  );

  React.useEffect(() => {
    for (let i = lives; i < totalLives; i++) {
      // Animate hearts to disappear for lost lives
      heartAnimations[i].value = 0.8; // Slight scale change to emphasize transition
    }

    for (let i = 0; i < lives; i++) {
      // Restore hearts for remaining lives
      heartAnimations[i].value = 1;
    }
  }, [lives]);

  return (
    <View className="flex flex-row justify-center items-center gap-2">
      {Array.from({ length: totalLives }, (_, index) => (
        <AnimatedHeart
          key={index}
          filled={index < lives}
          animatedStyle={animatedStyles[index]}
        />
      ))}
    </View>
  );
}
