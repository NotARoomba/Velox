import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

export default function Letters() {
  const letters = [..."/?<>⋅=+÷^*!±√Δ∞∑φπ∏∝∫"];
  const colors = ["#0074d9", "#7499fd", "#D7263D", "#1B998B"];
  const [height, setHeight] = useState(Dimensions.get("window").height);

  // Update height on resize
  useEffect(() => {
    const handleResize = () => setHeight(Dimensions.get("window").height);
    const emitter = Dimensions.addEventListener("change", handleResize);
    return () => emitter.remove();
  }, []);

  const AnimatedLetter = ({ index }: { index: number }) => {
    const startDelay = Math.random() * 8000; // Random delay up to 8s
    const duration = Math.random() * 50000 + 10000; // Random duration between 10s and 60s
    const size = Math.random() * 70 + 60; // Random size between 60 and 130
    const left = Math.random() * Dimensions.get("window").width;
    const rotation = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.6);
    const borderRadius = useSharedValue(0);

    useEffect(() => {
      rotation.value = withDelay(
        startDelay,
        withRepeat(withTiming(720, { duration }), -1, false)
      );
      translateY.value = withDelay(
        startDelay,
        withRepeat(withTiming(-1000, { duration }), -1, false)
      );
      opacity.value = withDelay(
        startDelay,
        withRepeat(withTiming(0, { duration }), -1, false)
      );
      borderRadius.value = withDelay(
        startDelay,
        withRepeat(withTiming(50, { duration }), -1, false)
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      borderRadius: borderRadius.value,
    }));

    return (
      <Animated.View
        className="absolute justify-center align-middle -bottom-32"
        style={[
          {
            left: left,
            width: size,
            height: size,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          className="h-full w-full"
          onPress={() => (index === 7 ? router.push("/secret") : undefined)}
        >
          <Text
            className="text-7xl text-center"
            style={{
              color: colors[Math.floor(Math.random() * colors.length)],
            }}
          >
            {letters[Math.floor(Math.random() * letters.length)]}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View
      className="absolute top-0 left-0 overflow-hidden w-full dark:bg-night bg-platinum h-screen -z-10"
      style={{ height }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <AnimatedLetter key={i} index={i} />
      ))}
    </View>
  );
}
