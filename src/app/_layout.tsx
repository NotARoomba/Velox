import { Stack } from "expo-router";
import AnimatedAppLoader from "../components/SplashScreen";
import Index from ".";
import "@/global.css";

export default function RootLayout() {
  return (
    <AnimatedAppLoader>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerShown: false,
          contentStyle: { backgroundColor: "#151515" },
        }}
      />
    </AnimatedAppLoader>
  );
}
