import React, { createRef, useEffect } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeOut,
  WithSpringConfig,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SliderProps } from "../utils/types";

export default function Slider({ options, setOption, selected }: SliderProps) {
  const pos = useSharedValue(0);
  const width = useSharedValue(0);
  const buttonsRef = createRef<View>();
  const springConfig: WithSpringConfig = {
    mass: 1,
    stiffness: 100,
    damping: 20,
  };
  // const objectWidth = width/options.length
  const firstRef = createRef();
  useEffect(() => {
    if (!selected) {
      width.value = 0;
    }
  }, [selected]);
  return (
    <View
      collapsable={false}
      className="flex flex-row mx-auto relative h-12 bg-platinum/10 rounded-2xl py-2"
    >
      {selected && (
        <Animated.View
          exiting={FadeOut}
          className="-z-10 bg-celtic_blue h-12 rounded-2xl absolute left-0 "
          style={{ width: width, transform: [{ translateX: pos }] }}
        />
      )}
      <View
        className={
          "flex flex-row transition-all duration-500 " +
          (!selected && " divide-x-2 divide-celtic_blue")
        }
        ref={buttonsRef}
        collapsable={false}
      >
        {options.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            key={i}
            onLayout={
              /* (i == 0 && !selected) || */ selected == v
                ? (e: LayoutChangeEvent) => {
                    setOption(v);
                    const layout = e.nativeEvent.layout;
                    width.value = withSpring(layout.width);
                    pos.value = withSpring(layout.x, springConfig);
                  }
                : undefined
            }
            onPress={(e: GestureResponderEvent) => {
              e.currentTarget.measure((_x, _y, w) => {
                pos.value = withSpring(w * i, springConfig);
                width.value = withSpring(w);
                setOption(v);
              });
            }}
            className="z-20"
          >
            <Text
              suppressHighlighting
              className="text-2xl font-semibold w-44 px-2 h-fit text-platinum text-center"
            >
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
