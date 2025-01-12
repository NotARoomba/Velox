import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import Icons from "@expo/vector-icons/Feather";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIconStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "auto",
          marginVertical: "auto",
          height: 38,
        },
        tabBarStyle: {
          display: "flex",
          backgroundColor: "#242424",
          position: "absolute",
          bottom: Platform.OS == "ios" ? 40 : 20,
          borderRadius: 12,
          width: 350,
          height: 60,
          marginHorizontal: "50%",
          transform: [{ translateX: -175 }],
          paddingBottom: 0,
          alignItems: "center",
          boxShadow: "4px 4px #0074d9",
          borderTopWidth: 0,
        },
        headerTransparent: true,
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name={"index"}
        options={{
          tabBarIcon: ({ color }) => (
            <Icons size={38} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"profile"}
        options={{
          tabBarIcon: ({ color }) => (
            <Icons size={38} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
