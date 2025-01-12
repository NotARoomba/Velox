import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        tabBarStyle: {
          display: "flex",
          backgroundColor: colorScheme == "dark" ? "#071932" : "#5B95A5",
          position: "absolute",
          bottom: Platform.OS == "ios" ? 40 : 20,
          borderRadius: 12,
          width: 350,
          left: "50%",
          marginLeft: -175,
          height: 60,
          paddingBottom: 0,
          alignItems: "center",
          shadowColor: colorScheme == "dark" ? "#000000" : "#ffffff",
          elevation: 0,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          borderTopWidth: 0,
        },
        headerTransparent: true,
        headerShown: false,
        tabBarInactiveTintColor: colorScheme == "dark" ? "gray" : "#023c4d",
        tabBarActiveTintColor: "#fbfff1",
      })}
    >
      <Tabs.Screen
        name={"index"}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons size={38} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"profile"}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons size={38} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
