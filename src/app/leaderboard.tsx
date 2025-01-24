import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import useFade from "../hooks/useFade";
import Slider from "../components/Slider";
import { useEffect, useState } from "react";
import { Game, Games, GameType } from "../utils/types";
import { supabase } from "../utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useLoading } from "../hooks/useLoading";
import { useSettings } from "../hooks/useSettings";
import HoloText from "../components/HoloText";
import { useTranslation } from "react-i18next";

export default function Leaderboard() {
  const opacity = useFade();
  const { theme } = useSettings();
  const [game, setGame] = useState(GameType.PI);
  const [circleLeaderboard, setCircleLeaderboard] = useState<Game[]>([]);
  const [approximationLeaderboard, setApproximationLeaderboard] = useState<
    Game[]
  >([]);
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: circleLeaderboard, error: circleError } = await supabase
        .from("games")
        .select()
        .eq("type", GameType.PI)
        .order("score", { ascending: false })
        .limit(10);
      if (circleError) return Alert.alert("Error", circleError.message);
      for (let game of circleLeaderboard) {
        try {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(game.avatar_url as string);
          game.avatar_url = data?.publicUrl;
        } catch (error) {
          if (error instanceof Error) {
            console.log("Error fetching image: ", error.message);
          }
        }
      }
      setCircleLeaderboard(circleLeaderboard as Game[]);
      const { data: approximationLeaderboard, error } = await supabase
        .from("games")
        .select()
        .eq("type", GameType.APPROXIMATION)
        .order("score", { ascending: false })
        .limit(10);
      if (error) return Alert.alert("Error", error.message);
      for (let game of approximationLeaderboard) {
        try {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(game.avatar_url as string);
          game.avatar_url = data?.publicUrl;
        } catch (error) {
          if (error instanceof Error) {
            console.log("Error fetching image: ", error.message);
          }
        }
      }
      setApproximationLeaderboard(approximationLeaderboard as Game[]);
      setLoading(false);
    })();
  }, []);
  return (
    <Animated.View style={{ opacity }} className="h-full bg-transparent flex">
      <HoloText
        fontSize={48}
        width={Dimensions.get("window").width}
        height={200}
      >
        {t("titles.leaderboard")}
      </HoloText>
      <View className="flex -translate-y-16">
        <Slider
          options={[t("buttons.circle"), t("buttons.approx")]}
          selected={
            game == GameType.PI ? t("buttons.circle") : t("buttons.approx")
          }
          setOption={(v) =>
            setGame(
              v === t("buttons.approx") ? GameType.APPROXIMATION : GameType.PI
            )
          }
        />
      </View>
      {game === GameType.PI ? (
        <ReAnimated.View
          key={"Circle"}
          className="h-full flex w-full"
          entering={SlideInRight.withInitialValues({ originX: 400 })}
          exiting={SlideOutRight}
        >
          <View className="flex flex-row mx-auto gap-x-28 my-2">
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              #
            </Text>
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              {t("titles.user")}
            </Text>
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              {t("titles.score")}
            </Text>
          </View>
          {circleLeaderboard.length == 0 ? (
            <Text className="dark:text-platinum text-night text-6xl mt-24 font-bold text-center">
              {t("errors.noScores")}
            </Text>
          ) : (
            <FlashList
              data={circleLeaderboard}
              className="mb-96"
              renderItem={({ item, index }) => (
                <View className="flex flex-row mx-auto gap-x-6 justify-around w-full my-2">
                  <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                    {index + 1}
                  </Text>
                  <View className="flex gap-4 flex-row">
                    <Image
                      className="w-16 h-16 rounded-2xl"
                      source={{ uri: item.avatar_url }}
                    />
                    <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                      {item.username}
                    </Text>
                  </View>
                  <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                    {item.score}
                  </Text>
                </View>
              )}
              estimatedItemSize={200}
            />
          )}
        </ReAnimated.View>
      ) : (
        <ReAnimated.View
          key={"Approx"}
          className="h-full flex"
          entering={SlideInLeft.withInitialValues({ originX: -400 })}
          exiting={SlideOutLeft}
        >
          <View className="flex flex-row mx-auto gap-x-28 my-2">
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              #
            </Text>
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              {t("titles.user")}
            </Text>
            <Text className="dark:text-platinum text-night my-auto font-bold text-3xl">
              {t("titles.score")}
            </Text>
          </View>
          {approximationLeaderboard.length == 0 ? (
            <Text className="dark:text-platinum text-night text-6xl mt-24 font-bold text-center">
              {t("errors.noScores")}
            </Text>
          ) : (
            <FlashList
              data={approximationLeaderboard}
              className="mb-96"
              renderItem={({ item, index }) => (
                <View className="flex flex-row mx-auto gap-x-6 justify-around w-full my-2">
                  <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                    {index + 1}
                  </Text>
                  <View className="flex gap-4 flex-row">
                    <Image
                      className="w-16 h-16 rounded-2xl"
                      source={{ uri: item.avatar_url }}
                    />
                    <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                      {item.username}
                    </Text>
                  </View>
                  <Text className="dark:text-platinum text-night my-auto font-bold text-2xl">
                    {item.score}
                  </Text>
                </View>
              )}
              estimatedItemSize={200}
            />
          )}
        </ReAnimated.View>
      )}

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
