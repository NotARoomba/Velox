import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useSession } from "../hooks/useSession";
import useFade from "../hooks/useFade";
import HoloText from "../components/effects/HoloText";
import { useTranslation } from "react-i18next";
import Letters from "../components/effects/Letters";
import StyledButton from "../components/buttons/StyledButton";

export default function Index() {
  const { hasSession } = useSession();
  const opacity = useFade();
  const { t } = useTranslation();
  return (
    <Animated.View
      style={{ opacity }}
      className="h-fit bg-transparent flex flex-col gap-0 pt-12"
    >
      <HoloText
        fontSize={128}
        width={Dimensions.get("window").width * 0.95}
        height={200}
      >
        Velox
      </HoloText>
      <View className="-translate-y-24 mx-auto">
        <Text className="text-2xl dark:text-platinum text-night text-center font-bold w-90">
          {t("description").split("\\")[0]}
        </Text>
        <Text className="text-2xl text-celtic_blue text-center font-bold ">
          {t("description").split("\\")[1]}
        </Text>
      </View>
      <View className="gap-y-6 -translate-y-12">
        <StyledButton
          testID="play_button"
          callback={() => router.push("/play")}
          text={t("titles.play")}
        />
        <StyledButton
          callback={() => router.push("/leaderboard")}
          text={t("titles.leaderboard")}
        />
        <StyledButton
          callback={() =>
            hasSession ? router.push("/profile") : router.push("/auth")
          }
          text={t("titles.profile")}
        />
        <StyledButton
          testID="settings_button"
          callback={() => router.push("/settings")}
          text={t("titles.settings")}
        />
      </View>
    </Animated.View>
  );
}
