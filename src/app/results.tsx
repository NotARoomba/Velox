import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Results() {
  const params = useLocalSearchParams();
  // params has the game and difficulty, also the statss
  return (
    <View className="h-full bg-night flex">
      <Text className="text-platinum m-auto">
        Results for {params.game} with difficulty: {params.difficulty}
      </Text>
    </View>
  );
}
