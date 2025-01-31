import { StyledButtonProps } from "@/src/utils/types";
import { router } from "expo-router";
import { t } from "i18next";
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";

export default function StyledButton({
  callback,
  text,
  disabled,
}: StyledButtonProps) {
  const colors = ["#45DDEA", "#0074d9", "#89DAFF", "#FCDEBE"];
  const [color] = useState(colors[Math.floor(Math.random() * colors.length)]);
  return (
    <TouchableOpacity
      disabled={disabled}
      className="dark:bg-platinum/10 bg-night/5  w-2/3 mx-auto py-3 rounded-2xl "
      style={{
        boxShadow: `4px 4px ${color}`,
      }}
      onPress={callback}
    >
      <Text className="dark:text-platinum text-night m-auto font-bold text-center text-4xl">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
