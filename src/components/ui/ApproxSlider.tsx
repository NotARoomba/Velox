import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  GestureResponderEvent,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ApproxSliderProps } from "../../utils/types";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";
import { useSettings } from "../../hooks/useSettings";

export default function ApproxSlider({
  inputNumber,
  onRelease,
  bounds,
}: ApproxSliderProps) {
  const [value, setValue] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const width = useSharedValue(0);
  const position = useSharedValue(Dimensions.get("window").width / 2);
  const { theme } = useSettings();
  useEffect(() => {
    width.set(0);
    position.set(Dimensions.get("window").width / 2);
    setDisabled(false);
    setValue((bounds[1] + bounds[0]) / 2);
  }, [inputNumber]);

  const parseRelease = () => {
    if (disabled) return;
    setDisabled(true);
    const w = 2 * (Dimensions.get("window").width * 0.1);
    width.value = withSpring(w);
    position.value = withSpring(
      Dimensions.get("window").width *
        0.9 *
        ((inputNumber - bounds[0]) / (bounds[1] - bounds[0])) -
        w / 2,
      undefined,
      () => {
        const rangeOffset = (bounds[1] - bounds[0]) * 0.15;
        const boundingBoxMin = inputNumber - rangeOffset;
        const boundingBoxMax = inputNumber + rangeOffset;
        // console.log(inputNumber, value, boundingBoxMin, boundingBoxMax);
        const isCorrect = value >= boundingBoxMin && value <= boundingBoxMax;
        runOnJS(onRelease)(isCorrect);
      }
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value },
        { translateY: Platform.OS == "ios" ? 11 : -9 },
      ],
      width: width.value,
      borderRadius: 9999,
    };
  });

  return (
    <View className="flex flex-col justify-center p-5 mx-auto">
      <View className="flex">
        <Slider
          disabled={disabled}
          style={{ width: Dimensions.get("window").width * 0.9, height: 1 }}
          minimumValue={bounds[0]}
          maximumValue={bounds[1]}
          value={value}
          step={0.1}
          trackImage={
            Platform.OS == "ios"
              ? require("@/assets/images/track.png")
              : undefined
          }
          thumbImage={
            Platform.OS == "ios"
              ? require("@/assets/images/thumb.png")
              : undefined
          }
          onResponderRelease={() => parseRelease()}
          onSlidingComplete={setValue}
          minimumTrackTintColor="#0074d9"
          maximumTrackTintColor="#e8e8e8"
          thumbTintColor="#0074d9"
        />
        <Animated.View
          style={animatedStyles}
          className="absolute bg-green-500/50 h-5 z-10"
        />
      </View>

      <View className="flex-row justify-between w-[90%] self-center mt-2">
        {bounds[1] == Math.PI ? (
          <>
            <MathJaxSvg
              fontSize={36}
              color={theme === "dark" ? "#e8e8e8" : "#151515"}
              fontCache={true}
            >
              {`$$-\\pi$$`}
            </MathJaxSvg>
            <MathJaxSvg
              fontSize={36}
              color={theme === "dark" ? "#e8e8e8" : "#151515"}
              fontCache={true}
            >
              {`$$\\pi$$`}
            </MathJaxSvg>
          </>
        ) : (
          <>
            <Text className="dark:text-platinum text-night text-3xl">
              {bounds[0]}
            </Text>
            <Text className="dark:text-platinum text-night text-3xl">
              {bounds[1]}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
