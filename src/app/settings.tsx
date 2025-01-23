import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useFade from "../hooks/useFade";
import HoloText from "../components/HoloText";
import Reanimated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { LANGUAGES } from "../utils/types";
import { supabase } from "../utils/supabase";
import { useSession } from "../hooks/useSession";
import Slider from "../components/Slider";
import LanguageButton from "../components/LanguageButton";

export default function Settings() {
  const opacity = useFade();
  const { hasSession } = useSession();
  const { setLanguage, setTheme, theme, language } = useSettings();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const itemWidth = 224;
  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / itemWidth);
    setLanguage(LANGUAGES[index].locale);
  };

  useEffect(() => {
    const languageIndex = LANGUAGES.findIndex((v) => v.locale === language);
    if (languageIndex !== -1 && scrollRef.current) {
      const scrollPosition = itemWidth * languageIndex;
      setTimeout(() => scrollRef.current?.scrollTo({ x: scrollPosition }), 100);
    }
  }, [scrollRef.current, opacity]);

  const handleButtonPress = () => {
    if (!isConfirmDelete) {
      setIsConfirmDelete(true);
    } else {
      Alert.alert(t("buttons.deleteAccount"), t("buttons.deleteAccountDesc"), [
        {
          text: t("buttons.cancel"),
          style: "cancel",
          onPress: () => setIsConfirmDelete(false),
        },
        {
          text: t("buttons.delete"),
          style: "destructive",
          onPress: () =>
            supabase.rpc("delete_user").then(async ({ error }) => {
              if (error) return Alert.alert("Error", error.message);
              else Alert.alert("Success", "Your account has been deleted");
              await supabase.auth.signOut();
              router.dismissTo("/");
            }),
        },
      ]);
      setIsConfirmDelete(false);
    }
  };

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isConfirmDelete ? 1 : 1, { duration: 300 }),
      backgroundColor: isConfirmDelete ? "#f87171" : "#808080",
    };
  });
  return (
    <Animated.View
      style={{ opacity }}
      className="h-full bg-transparent flex pt-16"
    >
      <HoloText
        width={Dimensions.get("window").width}
        height={128}
        fontSize={72}
      >
        Settings
      </HoloText>
      <View
        className={
          "m-auto " +
          (Platform.OS === "ios" ? "-translate-y-16" : "-translate-y-24")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold text-center mb-2">
          {t("buttons.theme")}
        </Text>
        <Slider
          options={[t("buttons.themes.dark"), t("buttons.themes.light")]}
          setOption={(v) =>
            setTheme(v == t("buttons.themes.dark") ? "dark" : "light")
          }
          selected={
            theme == "dark"
              ? t("buttons.themes.dark")
              : t("buttons.themes.light")
          }
        />
        <Text className="dark:text-platinum text-night text-3xl font-bold text-center mt-8 mb-2">
          {t("settings.languages")}
        </Text>

        {/* ScrollView with snapping behavior */}
        <ScrollView
          horizontal
          ref={scrollRef}
          snapToAlignment="start"
          decelerationRate={"fast"}
          snapToInterval={224}
          contentContainerStyle={{
            paddingHorizontal: Dimensions.get("window").width / 2 - 224 / 2,
          }}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          // scrollEventThrottle={16}
          className="flex flex-row h-12 overflow-scroll"
        >
          {LANGUAGES.map((v, i) => (
            <LanguageButton key={i} index={i} language={v} currentIndex={-1} />
          ))}
        </ScrollView>
        {hasSession && (
          <>
            <Text className="dark:text-platinum text-night text-3xl font-bold text-center mt-8 mb-2">
              {t("settings.danger")}
            </Text>

            {/* Double-click button */}
            <Reanimated.View
              style={[buttonStyle]}
              className="mx-auto leading-10 flex rounded-xl justify-center h-12 align-middle w-56"
            >
              <TouchableOpacity onPress={handleButtonPress}>
                <Text className="text-center text-2xl font-medium dark:text-platinum text-night">
                  {isConfirmDelete
                    ? t("settings.confirmDelete")
                    : t("settings.deleteAccount")}
                </Text>
              </TouchableOpacity>
            </Reanimated.View>
          </>
        )}
      </View>
      <Reanimated.View className="w-full absolute bottom-6">
        <Text className=" text-celtic_blue font-bold text-center text-xs w-11/12 mx-auto">
          {t("settings.credits")}
        </Text>
      </Reanimated.View>
      <Reanimated.View
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
      </Reanimated.View>
    </Animated.View>
  );
}
