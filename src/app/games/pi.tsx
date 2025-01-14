import Keypad from "@/src/components/Keypad";
import Lives from "@/src/components/Lives";
import { PI_DIGITS } from "@/src/utils/constants";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Alert, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import CurvedText from "@/src/components/CurvedText";

export default function PI() {
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(2); // Start after "3."
  const [guessed, setGuessed] = useState("3.");
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // Adjust for difficulty
  const [maxDigits, setMaxDigits] = useState(10);
  const rotation = useSharedValue(-120); // For circle rotation
  const [radius, setRadius] = useState(100); // For circle expansion
  const [gameOver, setGameOver] = useState(false);

  // Set difficulty-dependent settings
  useEffect(() => {
    if (params.difficulty === "Easy") {
      setMaxDigits(10);
      setTimeLeft(60);
    } else if (params.difficulty === "Medium") {
      setMaxDigits(50);
      setTimeLeft(120);
    } else if (params.difficulty === "Hard") {
      setMaxDigits(100);
      setTimeLeft(180);
    }
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (timeLeft === 0) {
          setGameOver(true);
          return Alert.alert("Game Over", "You ran out of time!");
        }
        setTimeLeft((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  // Handle user guess
  const handleGuess = (input: string) => {
    const correctDigit = PI_DIGITS[currentIndex];
    if (input === correctDigit) {
      // Update guessed digits and index
      setGuessed((prev) => prev + correctDigit);
      setCurrentIndex((prev) => prev + 1);

      // Animate circle rotation
      rotation.value = withSpring(
        rotation.value + -360 / (19 * (-rotation.value / 179))
      ); // Rotate for each correct guess and scale logarithmically
      console.log(rotation.value);
      // Increase circle radius every full rotation
      if (Math.abs(rotation.value) / 360 >= 1) {
        setRadius((r) => r + 6); // Increase radius smoothly
      }
    } else {
      setLives((prev) => prev - 1);
      if (lives === 1) {
        setGameOver(true);
        Alert.alert("Game Over", "You ran out of lives!");
      }
    }
  };

  // Animated styles for rotation
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
      width: radius,
      height: radius,
      borderRadius: 9999, // Keep the circle shape
    };
  });

  // Derived values for CurvedText dimensions

  return (
    <View className="h-full bg-transparent flex items-center justify-center">
      {/* Lives and Timer */}
      <View
        className={
          "absolute  left-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Lives lives={lives} />
      </View>
      <View
        className={
          "absolute  right-4 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Text className="text-platinum text-3xl font-bold">{timeLeft}</Text>
      </View>
      <View
        className={
          "absolute left-1/2 -translate-x-1/2 " +
          (Platform.OS === "android" ? " top-4" : "top-16")
        }
      >
        <Text className="text-platinum text-3xl font-bold">
          {guessed.length - 2}/{maxDigits}
        </Text>
      </View>

      {/* Rotating and Expanding Curved Text */}
      <View className="flex flex-col items-center justify-center">
        <Animated.View
          className="flex w-full"
          style={[
            animatedStyles,
            {
              backgroundColor: "#2B6CB0",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <CurvedText
            width={radius * 2}
            height={radius * 2}
            cx={radius}
            cy={radius}
            rx={radius}
            ry={radius}
            startOffset={0}
            reversed={true}
            text={guessed}
            svgProps={{
              style: { backgroundColor: "#00000000" },
            }}
            textPathProps={null}
            textProps={{ style: { fontSize: 60, fill: "#e8e8e8" } }}
            tspanProps={null}
          />
        </Animated.View>
      </View>

      {/* Keypad */}
      <Keypad
        disabled={gameOver}
        onDigitPress={(digit) => handleGuess(digit)}
      />
    </View>
  );
}
