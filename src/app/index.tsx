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
        <TouchableOpacity
          className="dark:bg-platinum/10 bg-night/5  w-2/3 mx-auto py-3 rounded-2xl"
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          onPress={() => router.push("/play")}
        >
          <Text className="dark:text-platinum text-night m-auto font-bold text-center text-4xl">
            {t("titles.play")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="dark:bg-platinum/10 bg-night/5  w-2/3 mx-auto py-3 rounded-2xl "
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          onPress={() => router.push("/leaderboard")}
        >
          <Text className="dark:text-platinum text-night m-auto font-bold text-center text-4xl">
            {t("titles.leaderboard")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="dark:bg-platinum/10 bg-night/5  w-2/3 mx-auto py-3 rounded-2xl"
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          onPress={() => router.push(hasSession ? "/profile" : "/auth")}
        >
          <Text className="dark:text-platinum text-night m-auto font-bold text-center text-4xl">
            {t("titles.profile")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="dark:bg-platinum/10 bg-night/5  w-2/3 mx-auto py-3 rounded-2xl"
          style={{
            boxShadow: "4px 4px #0074d9",
          }}
          onPress={() => router.push("/settings")}
        >
          <Text className="dark:text-platinum text-night m-auto font-bold text-center text-4xl">
            {t("titles.settings")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
