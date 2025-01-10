import { Stack } from "expo-router";
import AnimatedAppLoader from "../components/SplashScreen";
import "@/global.css";
import { useState } from "react";
import { Text } from "react-native";
import Index from ".";

export default function RootLayout() {
  return (
    <AnimatedAppLoader>
      <Index />
    </AnimatedAppLoader>
  );
}
