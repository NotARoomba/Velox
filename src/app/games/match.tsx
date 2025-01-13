import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Match() {
  const params = useLocalSearchParams();
  return (
    <View className="h-full bg-night flex">
      <Text className="text-platinum m-auto">
        Match with difficulty: {params.difficulty}
      </Text>
    </View>
  );
}
