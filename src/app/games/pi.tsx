import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function PI() {
  const params = useLocalSearchParams();
  return (
    <View className="h-full bg-night flex">
      <Text className="text-platinum m-auto">
        Round The Circle (PI) with difficulty: {params.difficulty}
      </Text>
    </View>
  );
}
