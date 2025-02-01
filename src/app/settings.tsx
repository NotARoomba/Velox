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
import HoloText from "../components/effects/HoloText";
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
import Slider from "../components/buttons/Slider";
import LanguageButton from "../components/buttons/LanguageButton";

export default function Settings() {
  const opacity = useFade();
  const { hasSession } = useSession();
  const { setLanguage, setTheme, theme, language } = useSettings();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [secretPresses, setSecretPresses] = useState(0);
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
              if (error) return Alert.alert(t("error"), error.message);
              else Alert.alert(t("success"), "Your account has been deleted");
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
      backgroundColor: isConfirmDelete
        ? "#ef4444"
        : theme == "dark"
        ? "#e8e8e820"
        : "#15151520",
    };
  });
  return (
    <Animated.View
      style={{ opacity }}
      // onTouchEnd={() =>
      //   setIsConfirmDelete(isConfirmDelete ? false : isConfirmDelete)
      // }
      className="h-full bg-transparent flex pt-16"
    >
      <HoloText
        className="mx-auto"
        width={Dimensions.get("window").width}
        height={144}
        fontSize={72}
      >
        {t("titles.settings")}
      </HoloText>
      <View
        className={
          "m-auto " +
          (Platform.OS === "ios" ? "-translate-y-16" : "-translate-y-24")
        }
      >
        <Text className="dark:text-platinum text-night text-3xl font-bold text-center mb-2">
          {t("settings.theme")}
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
        <Text className=" text-3xl font-bold text-center dark:text-platinum text-night mt-8 mb-2">
          {t("settings.languages")}
        </Text>

        {/* ScrollView with snapping behavior */}
        <ScrollView
          testID="language_scrollview"
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
            <LanguageButton
              key={i}
              index={i}
              language={v}
              currentIndex={LANGUAGES.findIndex((v) => v.locale === language)}
            />
          ))}
        </ScrollView>
        {hasSession && (
          <>
            <Text className="dark:text-platinum text-night text-3xl font-bold text-center mt-8 mb-2">
              {t("settings.danger")}
            </Text>

            {/* Double-click button */}
            <Reanimated.View
              style={[
                buttonStyle,
                {
                  boxShadow: !isConfirmDelete
                    ? "4px 4px #ef4444"
                    : "4px 4px #15151520",
                },
              ]}
              className="mx-auto leading-10 bg-red flex rounded-xl justify-center h-12 align-middle w-56"
            >
              <TouchableOpacity onPress={handleButtonPress}>
                <Text
                  className={`text-center text-2xl font-medium ${
                    isConfirmDelete
                      ? "text-platinum"
                      : "dark:text-platinum text-night"
                  }`}
                >
                  {isConfirmDelete
                    ? t("settings.confirmDelete")
                    : t("settings.deleteAccount")}
                </Text>
              </TouchableOpacity>
            </Reanimated.View>
          </>
        )}
      </View>
      <Reanimated.View
        onTouchStart={() => {
          if (secretPresses >= 3) {
            setSecretPresses(0);
            router.push("/secret");
          } else setSecretPresses((v) => v + 1);
        }}
        className="w-full absolute bottom-6"
      >
        <Text className=" text-celtic_blue font-bold  text-center text-xs w-11/12 mx-auto">
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
        <TouchableOpacity testID="settings_back_button" onPress={router.back}>
          <Ionicons
            color={theme === "dark" ? "#e8e8e8" : "#151515"}
            size={40}
            name="arrow-back"
          />
        </TouchableOpacity>
      </Reanimated.View>
    </Animated.View>
  );
}
