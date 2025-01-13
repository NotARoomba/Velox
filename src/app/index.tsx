import { router } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSession } from "../hooks/useSession";
import Letters from "../components/Letters";

export default function Index() {
  const { hasSession } = useSession();
  return (
    <View className="h-fit bg-transparent flex flex-col gap-0">
      <Image
        className="flex h-64 aspect-video mx-auto"
        resizeMode="contain"
        source={require("@/assets/images/velox.png")}
      />
      <View className="-translate-y-16 mx-auto">
        <Text className="text-2xl text-platinum text-center font-bold w-90">
          An app that helps improve your
        </Text>
        <Text className="text-2xl text-pale_azure text-center font-bold ">
          mental math skills
        </Text>
      </View>
      <TouchableOpacity
        className="bg-platinum/10  w-2/3 mx-auto py-3 rounded-2xl"
        style={{
          boxShadow: "4px 4px #0074d9",
        }}
        onPress={() => router.push("/play")}
      >
        <Text className="text-platinum m-auto font-bold text-center text-4xl">
          Play
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-platinum/10  w-2/3 mx-auto py-3 mt-6 rounded-2xl"
        style={{
          boxShadow: "4px 4px #0074d9",
        }}
        onPress={() => router.push(hasSession ? "/profile" : "/auth")}
      >
        <Text className="text-platinum m-auto font-bold text-center text-4xl">
          {hasSession ? "Profile" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
