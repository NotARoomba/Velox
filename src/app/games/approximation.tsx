import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Approximation() {
  const params = useLocalSearchParams();
  return (
    <View className="h-full bg-night flex">
      <Text className="text-platinum m-auto">
        Approximation with difficulty: {params.difficulty}
      </Text>
    </View>
  );
}
