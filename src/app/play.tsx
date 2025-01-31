import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Games } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import useFade from "../hooks/useFade";
import { useSettings } from "../hooks/useSettings";
import HoloText from "../components/effects/HoloText";
import { useTranslation } from "react-i18next";
import StyledButton from "../components/buttons/StyledButton";
import { useSession } from "../hooks/useSession";

export default function Play() {
  const opacity = useFade();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { hasSession } = useSession();
  return (
    <Animated.View
      style={{ opacity }}
      className="h-full bg-transparent flex pt-12"
    >
      <HoloText
        fontSize={128}
        width={Dimensions.get("window").width}
        height={200}
      >
        {t("titles.play")}
      </HoloText>
      <View className="flex flex-col gap-y-6 -translate-y-8">
        <StyledButton
          callback={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.APPROXIMATION, multiplayer: 0 },
            })
          }
          text={t("games.approximation.title")}
        />
        <StyledButton
          callback={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.MATCH, multiplayer: 0 },
            })
          }
          text={t("buttons.match")}
        />
        <StyledButton
          callback={() =>
            router.push({
              pathname: `/difficulty`,
              params: { game: Games.PI, multiplayer: 0 },
            })
          }
          text={"π"}
        />
        <StyledButton
          callback={() =>
            hasSession ? router.push(`/multiplayer`) : router.push(`/auth`)
          }
          text={t("titles.multiplayer")}
        />
      </View>
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
    </Animated.View>
  );
}
