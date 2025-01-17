import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

export default function ApproxSlider({ inputNumber }: { inputNumber: number }) {
  const [value, setValue] = React.useState(inputNumber);
  const minValue = inputNumber - 10;
  const maxValue = inputNumber + 10;

  return (
    <View className="flex flex-col justify-center p-5 mx-auto">
      <Slider
        style={{ width: "90%", height: 40 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#1E90FF"
      />
      <View className="flex-row justify-between w-[90%] self-center mt-2">
        <Text className="text-platinum text-3xl">{minValue}</Text>
        <Text className="text-platinum text-3xl">{maxValue}</Text>
      </View>
    </View>
  );
}
