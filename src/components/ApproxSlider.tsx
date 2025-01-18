import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, GestureResponderEvent } from "react-native";
import Slider from "@react-native-community/slider";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Difficulty } from "../utils/types";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";

export default function ApproxSlider({
  inputNumber,
  onRelease,
  difficulty,
}: {
  inputNumber: number;
  onRelease: (event: boolean) => void;
  difficulty: Difficulty;
}) {
  const [value, setValue] = useState(0);
  const [minMax, setMinMax] = useState([inputNumber, inputNumber]);
  const [disabled, setDisabled] = useState(false);
  const width = useSharedValue(0);
  const position = useSharedValue(Dimensions.get("window").width / 2);
  let preMinMax = [0, 0];
  useEffect(() => {
    width.set(0);
    position.set(Dimensions.get("window").width / 2);
    setDisabled(false);
    if (difficulty === Difficulty.EASY) {
      preMinMax = [
        Math.floor(inputNumber - Math.random() * 10),
        Math.floor(inputNumber + Math.random() * 10),
      ];
    } else if (difficulty === Difficulty.MEDIUM) {
      preMinMax = [
        Math.floor(inputNumber - Math.random() * 20 + 5),
        Math.floor(inputNumber + Math.random() * 20 + 5),
      ];
    } else if (difficulty === Difficulty.HARD) {
      if (Math.abs(inputNumber) < Math.PI) preMinMax = [-Math.PI, Math.PI];
      else
        preMinMax = [
          Math.floor(inputNumber - Math.random() * 30 - 11),
          Math.floor(inputNumber + Math.random() * 30 + 11),
        ];
    }
    setValue((preMinMax[1] + preMinMax[0]) / 2);
    setMinMax(preMinMax);
  }, [inputNumber]);

  const parseRelease = () => {
    if (disabled) return;
    setDisabled(true);
    const w = 2 * (Dimensions.get("window").width * 0.1);
    width.value = withSpring(w);
    position.value = withSpring(
      Dimensions.get("window").width *
        0.9 *
        ((inputNumber - minMax[0]) / (minMax[1] - minMax[0])) -
        w / 2,
      undefined,
      () => {
        const rangeOffset = (minMax[1] - minMax[0]) * 0.15;
        const boundingBoxMin = inputNumber - rangeOffset;
        const boundingBoxMax = inputNumber + rangeOffset;
        console.log(inputNumber, value, boundingBoxMin, boundingBoxMax);
        const isCorrect = value >= boundingBoxMin && value <= boundingBoxMax;
        runOnJS(onRelease)(isCorrect);
      }
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }, { translateY: 11 }],
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
          minimumValue={minMax[0]}
          maximumValue={minMax[1]}
          value={value}
          trackImage={require("@/assets/images/track.png")}
          thumbImage={require("@/assets/images/thumb.png")}
          onResponderRelease={() => parseRelease()}
          onValueChange={setValue}
          minimumTrackTintColor="#0074d9"
          maximumTrackTintColor="#e8e8e8"
        />
        <Animated.View
          style={animatedStyles}
          className="absolute bg-green-500/50 h-5 z-10"
        />
      </View>

      <View className="flex-row justify-between w-[90%] self-center mt-2">
        {minMax[1] == Math.PI ? (
          <>
            <MathJaxSvg fontSize={36} color={"#e8e8e8"} fontCache={true}>
              {`$$-\\pi$$`}
            </MathJaxSvg>
            <MathJaxSvg fontSize={36} color="#e8e8e8" fontCache={true}>
              {`$$\\pi$$`}
            </MathJaxSvg>
          </>
        ) : (
          <>
            <Text className="text-platinum text-3xl">{minMax[0]}</Text>
            <Text className="text-platinum text-3xl">{minMax[1]}</Text>
          </>
        )}
      </View>
    </View>
  );
}
