import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AppState,
} from "react-native";
import Slider from "../components/Slider";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutLeft,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../utils/supabase";
import prompt from "@powerdesigninc/react-native-prompt";
import { router } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [choice, setChoice] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("AUTH");
  }, []);

  async function verifyEmail(code: string) {
    setLoading(true);
    const {
      error,
      data: { session },
    } = await supabase.auth.verifyOtp({
      token: code,
      email: email,
      type: "email",
    });
    setLoading(false);
    if (error) Alert.alert(error.message);
    else if (session && session.user.user_metadata.username === null) {
      Alert.alert("Please sign up first!");
      setChoice("Sign Up");
    } else router.navigate("/");
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      Alert.alert(error.message);
      return setLoading(false);
    }
    prompt("Verification Code", "Enter the code sent to your email", [
      {
        style: "default",
        text: "Verify",
        onPress: (code) => {
          if (code) verifyEmail(code);
          else Alert.alert("Please enter a code!");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        data: {
          username: username,
          created_at: new Date().toISOString().toLocaleString(),
          updated_at: new Date().toISOString().toLocaleString(),
        },
      },
    });

    if (error) {
      Alert.alert(error.message);
      return setLoading(false);
    }
    prompt("Verification Code", "Enter the code sent to your email", [
      {
        style: "default",
        text: "Verify",
        onPress: (code) => {
          if (code) verifyEmail(code);
          else Alert.alert("Please enter a code!");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
    setLoading(false);
  }

  return (
    <Animated.View
      entering={FadeIn.duration(1000)}
      className="flex bg-transparent h-full w-full items-center justify-center"
    >
      {choice === "Login" ? (
        <Animated.View
          key={"Login"}
          className="h-full flex w-full"
          entering={SlideInRight.withInitialValues({ originX: 400 })}
          exiting={SlideOutRight}
        >
          <Image
            className="flex h-36 mt-32"
            resizeMode="contain"
            source={require("@/assets/images/login.png")}
          />
          <View className="flex flex-col gap-y-4 w-full">
            <KeyboardAvoidingView
              className="h-fit"
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text className="text-2xl text-platinum font-bold text-center">
                Email
              </Text>
              <TextInput
                className="h-12 w-2/3 bg-platinum/10 rounded-2xl mx-auto mt-1 text-center text-platinum text-nowrap"
                placeholder="email@address.com"
                placeholderTextColor={"#737373"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                enterKeyHint="done"
              />
            </KeyboardAvoidingView>
            <TouchableOpacity
              disabled={loading}
              className="h-12 w-2/3 bg-celtic_blue rounded-2xl mx-auto mt-6 flex items-center justify-center"
              onPress={signInWithEmail}
            >
              <Text className="text-platinum text-center font-bold">
                {loading ? "Loading..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          key={"SignUp"}
          className="h-full flex"
          entering={SlideInLeft.withInitialValues({ originX: -400 })}
          exiting={SlideOutLeft}
          // onTouchStart={Keyboard.dismiss}
        >
          <Image
            className="flex h-32 mt-32"
            resizeMode="contain"
            source={require("@/assets/images/signup.png")}
          />
          <View className="flex flex-col gap-y-4">
            <KeyboardAvoidingView
              className="h-fit"
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text className="text-2xl text-platinum font-bold text-center">
                Username
              </Text>
              <TextInput
                className="h-12 w-1/2 bg-platinum/10 rounded-2xl mx-auto mt-1 text-center text-platinum text-nowrap"
                placeholder="Username"
                placeholderTextColor={"#737373"}
                value={username}
                onChangeText={(text) => setUsername(text)}
                enterKeyHint="done"
              />
            </KeyboardAvoidingView>
            <KeyboardAvoidingView
              className="h-fit"
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text className="text-2xl text-platinum font-bold text-center">
                Email
              </Text>
              <TextInput
                className="h-12 w-1/2 bg-platinum/10 rounded-2xl mx-auto mt-1 text-center text-platinum text-nowrap"
                placeholder="email@address.com"
                placeholderTextColor={"#737373"}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
                enterKeyHint="done"
              />
            </KeyboardAvoidingView>
            <TouchableOpacity
              disabled={loading}
              className="h-12 w-1/2 bg-celtic_blue rounded-2xl mx-auto mt-6 flex items-center justify-center"
              onPress={signUpWithEmail}
            >
              <Text className="text-platinum text-center font-bold">
                {loading ? "Loading..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {choice && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className={
            "absolute  left-4 " +
            (Platform.OS === "android" ? " top-4" : "top-16")
          }
        >
          <TouchableOpacity onPress={router.back}>
            <Ionicons color="#e8e8e8" size={40} name="arrow-back" />
          </TouchableOpacity>
        </Animated.View>
      )}
      <KeyboardAvoidingView
        behavior={undefined}
        className={
          "absolute  z-50 " +
          (Platform.OS === "android" ? "bottom-4" : "bottom-12")
        }
      >
        <Slider
          options={["Login", "Sign Up"]}
          selected={choice}
          setOption={setChoice}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
