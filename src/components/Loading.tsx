import { View, ActivityIndicator, Text } from "react-native";
import { useLoading } from "../hooks/useLoading";
import { useEffect } from "react";

export default function Loading() {
  const { loading } = useLoading();
  return (
    loading && (
      <View className="flex-1 absolute h-screen w-screen z-50 bg-night/50 justify-center items-center">
        <ActivityIndicator size="large" color="#e8e8e8" />
        <Text className="text-platinum font-bold text-2xl text-center">
          Loading
        </Text>
      </View>
    )
  );
}
