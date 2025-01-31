import {
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import useFade from "../hooks/useFade";
import HoloText from "../components/effects/HoloText";
import { useTranslation } from "react-i18next";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSettings } from "../hooks/useSettings";
import { useEffect, useState } from "react";
import StyledButton from "../components/buttons/StyledButton";
import { useSession } from "../hooks/useSession";
import { supabase } from "../utils/supabase";
import { useLoading } from "../hooks/useLoading";
import { Database, Tables } from "@/database.types";

export default function Multiplayer() {
  const opacity = useFade();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const [joinCode, setJoinCode] = useState("");
  const { session } = useSession();
  const { setLoading } = useLoading();
  async function joinGame() {
    setLoading(true);
    if (session) {
      let { data, error } = await supabase.rpc("join_multiplayer_game", {
        game_code: joinCode.trim(),
      });
      console.log(data);
      if (error) Alert.alert(t("error"), error.message);
      else {
        router.push({
          pathname:
            data[0].game_type == 0
              ? "/games/pi"
              : data[0].game_type == 1
              ? "/games/approximation"
              : "/games/match",
          params: {
            multiplayer: 1,
            code: joinCode,
            join: 1,
          },
        });
      }
    } else Alert.alert(t("error"), t("errors.generic"));
    setLoading(false);
  }
  async function createGame() {
    setLoading(true);
    if (session) {
      let { data, error } = await supabase.rpc("initialize_multiplayer_game");
      if (error) Alert.alert(t("error"), error.message);
      else if (data) {
        router.push({
          pathname:
            data[0].game_type == 0
              ? "/games/pi"
              : data[0].game_type == 1
              ? "/games/approximation"
              : "/games/match",
          params: {
            multiplayer: 1,
            code: data[0].new_code,
            join: 0,
          },
        });
      }
    } else Alert.alert(t("error"), t("errors.generic"));
    setLoading(false);
  }
  useEffect(() => {
    setLoading(true);
    const checkInGame = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("multiplayer_games")
          .select("*")
          .eq("is_over", false) // Check for games that are not over
          .in(
            "code",
            (
              (
                await supabase
                  .from("multiplayer_players")
                  .select("code")
                  .eq("user_id", session.user.id)
              ).data as unknown as Tables<"multiplayer_players">[]
            ).map((game) => {
              return game.code;
            })
          );
        setLoading(false);
        if (error) return Alert.alert(t("error"), error.message);
        if (data.length) {
          router.push({
            pathname:
              data[0].game_type == 0
                ? "/games/pi"
                : data[0].game_type == 1
                ? "/games/approximation"
                : "/games/match",
            params: {
              multiplayer: 1,
              code: data[0].code,
              join: 1,
            },
          });
        }
      } else Alert.alert(t("error"), t("errors.generic"));
      setLoading(false);
    };
    checkInGame();
  }, []);
  return (
    <Animated.View
      style={{ opacity }}
      className="h-fit bg-transparent flex flex-col gap-0 pt-12"
    >
      <HoloText
        fontSize={64}
        width={Dimensions.get("window").width}
        height={200}
      >
        {t("titles.multiplayer")}
      </HoloText>
      <View className="gap-y-6 -translate-y-12">
        <TextInput
          className="w-2/3 py-3 dark:bg-platinum/10 bg-night/10 rounded-2xl mx-auto mt-1 text-center  text-3xl dark:text-platinum text-night text-nowrap"
          placeholder="000000"
          maxLength={6}
          placeholderTextColor={"#737373"}
          value={joinCode}
          autoCapitalize="characters"
          onChangeText={(text) => setJoinCode(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          enterKeyHint="done"
        />
        <StyledButton callback={joinGame} text={t("buttons.join")} />
        {/* <StyledButton callback={() => 0} text={t("buttons.findRandom")} /> */}
        <StyledButton callback={createGame} text={t("buttons.host")} />
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
