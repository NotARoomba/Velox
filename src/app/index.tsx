import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Info from "./info";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

const Stack = createStackNavigator();

export default function Index() {
  //check if logged in then isplay a certain stack or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <View className="flex bg-night text-platinum h-full">
      {!isLoggedIn ? (
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerShown: false,
          }}
        >
          <Stack.Screen name="info" component={Info} />
          <Stack.Screen name="sign-in" component={SignIn} />
          <Stack.Screen name="sign-up" component={SignUp} />
        </Stack.Navigator>
      ) : (
        <Text className="text-white m-auto">LOGGED IN</Text>
      )}
    </View>
  );
}
