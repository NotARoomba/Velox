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
  Animated,
  Dimensions,
} from "react-native";
import Slider from "../components/buttons/Slider";
import ReAnimated, {
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
import useFade from "../hooks/useFade";
import { theme } from "@/tailwind.config";
import HoloText from "../components/effects/HoloText";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "react-i18next";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const { t } = useTranslation();
  const [choice, setChoice] = useState(t("titles.login"));
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const opacity = useFade();
  const { theme } = useSettings();

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
      Alert.alert(t("errors.noAccount"));
      setChoice(t("titles.signup"));
    } else router.replace("/");
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
    prompt(
      t("verification.title"),
      t("verification.description"),
      [
        {
          style: "default",
          text: t("verification.verify"),
          onPress: (code) => {
            if (code) verifyEmail(code);
            else Alert.alert(t("errors.enterCode"));
          },
        },
        {
          text: t("buttons.cancel"),
          style: "cancel",
        },
      ],
      undefined,
      "numeric"
    );
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
    prompt(
      t("verification.title"),
      t("verification.description"),
      [
        {
          style: "default",
          text: t("verification.verify"),
          onPress: (code) => {
            if (code) verifyEmail(code);
            else Alert.alert(t("errors.enterCode"));
          },
        },
        {
          text: t("buttons.cancel"),
          style: "cancel",
        },
      ],
      undefined,
      "numeric"
    );
    setLoading(false);
  }

  return (
    <Animated.View
      style={{ opacity }}
      className="flex bg-transparent h-full w-full items-center justify-center"
    >
      {choice === t("titles.login") ? (
        <ReAnimated.View
          key={"Login"}
          className="h-full flex w-full pt-12"
          entering={SlideInLeft.withInitialValues({ originX: 400 })}
          exiting={SlideOutRight}
        >
          <HoloText
            fontSize={82}
            width={Dimensions.get("window").width}
            height={200}
          >
            {t("titles.login")}
          </HoloText>
          <View className="flex flex-col gap-y-4 w-full">
            <KeyboardAvoidingView
              className="h-fit"
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text className="text-2xl dark:text-platinum text-night font-bold text-center">
                {t("inputs.email")}
              </Text>
              <TextInput
                className="h-12 w-1/2 dark:bg-platinum/10 bg-night/10 rounded-2xl mx-auto mt-1 text-center dark:text-platinum text-night text-nowrap"
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
              <Text className="dark:text-platinum text-night text-center font-bold">
                {loading ? t("loading") : t("titles.login")}
              </Text>
            </TouchableOpacity>
          </View>
        </ReAnimated.View>
      ) : (
        <ReAnimated.View
          key={"SignUp"}
          className="h-full flex pt-12"
          entering={SlideInLeft.withInitialValues({ originX: -400 })}
          exiting={SlideOutLeft}
          // onTouchStart={Keyboard.dismiss}
        >
          <HoloText
            fontSize={82}
            width={Dimensions.get("window").width}
            height={200}
          >
            {t("titles.signup")}
          </HoloText>
          <View className="flex flex-col gap-y-4">
            <KeyboardAvoidingView
              className="h-fit"
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text className="text-2xl dark:text-platinum text-night font-bold text-center">
                {t("inputs.username")}
              </Text>
              <TextInput
                className="h-12 w-1/2 dark:bg-platinum/10 bg-night/10 rounded-2xl mx-auto mt-1 text-center dark:text-platinum text-night text-nowrap"
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
              <Text className="text-2xl dark:text-platinum text-night font-bold text-center">
                {t("inputs.email")}
              </Text>
              <TextInput
                className="h-12 w-1/2 bg-platinum/10 rounded-2xl mx-auto mt-1 text-center dark:text-platinum text-night text-nowrap"
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
              <Text className="dark:text-platinum text-night text-center font-bold">
                {loading ? t("loading") : t("titles.signup")}
              </Text>
            </TouchableOpacity>
          </View>
        </ReAnimated.View>
      )}
      {choice && (
        <ReAnimated.View
          entering={FadeIn}
          exiting={FadeOut}
          className={
            "absolute  left-4 " +
            (Platform.OS === "android" ? " top-4" : "top-16")
          }
        >
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              color={theme === "dark" ? "#e8e8e8" : "#151515"}
              size={40}
              name="arrow-back"
            />
          </TouchableOpacity>
        </ReAnimated.View>
      )}
      <KeyboardAvoidingView
        behavior={undefined}
        className={
          "absolute  z-50 " +
          (Platform.OS === "android" ? "bottom-4" : "bottom-12")
        }
      >
        <Slider
          options={[t("titles.login"), t("titles.signup")]}
          selected={choice}
          setOption={setChoice}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
