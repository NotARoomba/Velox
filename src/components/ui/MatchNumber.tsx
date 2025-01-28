import { MatchNumberProps } from "@/src/utils/types";
import { useEffect } from "react";
import { TouchableOpacity, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  FadeIn,
  FadeOut,
  Easing,
} from "react-native-reanimated";

export default function MatchNumber({
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
        //   entering={FadeIn.duration(1000)}
        //   exiting={FadeOut.duration(500)}
        style={[gridStyle]}
        className={
          "flex items-center justify-center w-10/12 aspect-square dark:bg-platinum/10 bg-night/5 rounded-2xl "
        }
      >
        <Pressable
          key={number}
          onPress={() =>
            setSelected((prev: number) => (prev == number ? -1 : number))
          }
          className="w-full h-full flex items-center justify-center"
        >
          <Text className="text-5xl font-bold dark:text-platinum text-night">
            {number}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
