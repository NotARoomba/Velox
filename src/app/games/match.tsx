import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Match() {
  const params = useLocalSearchParams();
  return (
    <View className="h-full dark:bg-night bg-platinum flex">
      <Text className="dark:text-platinum text-night m-auto">
        Match with difficulty: {params.difficulty}
      </Text>
    </View>
  );
}
