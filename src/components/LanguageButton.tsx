import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LanguageButtonProps } from "../utils/types";
import { useEffect } from "react";

export default function LanguageButton({
  language,
  index,
  currentIndex,
}: LanguageButtonProps) {
  // //console.log(index, currentIndex);
  const color = useSharedValue("#002f58");
  useEffect(() => {
    if (index == currentIndex)
      color.value = withTiming("#0074d9", {
        duration: 300,
      });
    else
      color.value = withTiming("#002f58", {
        duration: 300,
      });
  }, [currentIndex]);
  const animatedStyle = useAnimatedStyle(() => {
    return { backgroundColor: color.value };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className={`snap-center mx-4 celtic  leading-10 transition-all duration-300 flex rounded-xl justify-center h-12 py-auto max-w-56 w-56 `}
    >
      <Animated.Text className="text-center bg-transparent text-platinum text-2xl font-medium">
        {language.name}
      </Animated.Text>
    </Animated.View>
  );
}
