import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KeypadProps } from "../utils/types";

export default function Keypad({ onDigitPress, disabled }: KeypadProps) {
  const digits = [..."1234567890"];

  return (
    <View className="flex flex-row flex-wrap justify-center gap-4 p-4 w-full">
      {digits.map((digit) => (
        <TouchableOpacity
          disabled={disabled}
          key={digit}
          className="w-1/4 h-16 bg-celtic_blue rounded-2xl flex items-center justify-center shadow-lg"
          onPress={() => onDigitPress(digit)}
        >
          <Text className="text-2xl font-bold text-platinum">{digit}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
