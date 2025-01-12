import { View, Text, Image, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View className="h-full bg-night flex flex-col gap-0">
      <Image
        className="flex w-full mx-auto"
        resizeMode="contain"
        source={require("@/assets/images/velox.png")}
      />
      <TouchableOpacity
        className="bg-platinum/10  w-2/3 mx-auto py-3 rounded-2xl"
        style={{
          boxShadow: "4px 4px #0074d9",
        }}
      >
        <Text className="text-platinum m-auto font-bold text-center text-4xl">
          Play
        </Text>
      </TouchableOpacity>
    </View>
  );
}
