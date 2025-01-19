import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReAnimated, { FadeIn, FadeOut } from "react-native-reanimated";
import useFade from "../hooks/useFade";
import Slider from "../components/Slider";
import { useEffect, useState } from "react";
import { Game, Games, GameType } from "../utils/types";
import { supabase } from "../utils/supabase";
import { FlashList } from "@shopify/flash-list";

export default function Leaderboard() {
  const opacity = useFade();
  const [game, setGame] = useState(GameType.PI);
  const [circleLeaderboard, setCircleLeaderboard] = useState<Game[]>([]);
  const [approximationLeaderboard, setApproximationLeaderboard] = useState<
    Game[]
  >([]);
  useEffect(() => {
    (async () => {
      const { data: circleLeaderboard, error } = await supabase
        .from("games")
        .select()
        .eq("type", GameType.PI)
        .order("score", { ascending: false })
        .limit(10);
      console.log(circleLeaderboard);
      if (error) return Alert.alert("Error", error.message);
      for (let game of circleLeaderboard) {
        try {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(game.avatar_url as string);

          if (error) {
            throw error;
          }
          game.avatar_url = data?.publicUrl;
        } catch (error) {
          if (error instanceof Error) {
            console.log("Error fetching image: ", error.message);
          }
        }
      }
      setCircleLeaderboard(circleLeaderboard as Game[]);
    })();
    (async () => {
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

          if (error) {
            throw error;
          }
          game.avatar_url = data?.publicUrl;
        } catch (error) {
          if (error instanceof Error) {
            console.log("Error fetching image: ", error.message);
          }
        }
      }
      setApproximationLeaderboard(approximationLeaderboard as Game[]);
    })();
  }, []);
  return (
    <Animated.View style={{ opacity }} className="h-full bg-transparent flex">
      <Image
        className="flex h-56 aspect-video mx-auto mt-12"
        resizeMode="contain"
        source={require("@/assets/images/leaderboard.png")}
      />
      <View className="flex -translate-y-16">
        <Slider
          options={["Circle", "Approx"]}
          selected={game == GameType.PI ? "Circle" : "Approximation"}
          setOption={(v) =>
            setGame(
              v === "Approximation" ? GameType.APPROXIMATION : GameType.PI
            )
          }
        />
      </View>
      {circleLeaderboard.length == 0 && approximationLeaderboard.length == 0 ? (
        <Text className="text-platinum text-6xl mt-24 font-bold text-center">
          There are no scores!
        </Text>
      ) : (
        <FlashList
          data={
            game == GameType.PI ? circleLeaderboard : approximationLeaderboard
          }
          renderItem={({ item }) => <Text>{item.score}</Text>}
          estimatedItemSize={200}
        />
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
          <Ionicons color="#e8e8e8" size={40} name="arrow-back" />
        </TouchableOpacity>
      </ReAnimated.View>
    </Animated.View>
  );
}
