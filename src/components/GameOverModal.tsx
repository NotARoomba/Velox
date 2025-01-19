import { Button, View, Text, TouchableOpacity, Alert } from "react-native";
import { Game } from "../utils/types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useSession } from "../hooks/useSession";
import { Link } from "expo-router";

export default function GameOverModal({
  game,
  onRestart,
  onQuit,
}: {
  game: Game;
  onRestart: () => void;
  onQuit: () => void;
}) {
  const sessionData = useSession();
  const [highScore, setHighScore] = useState<Game>();
  useEffect(() => {
    // get th high score and sleect where he user column is equal to the auth userid
    const fetchHighScore = async () => {
      const { data, error } = await supabase
        .from("games")
        .select()
        .eq("type", game.type)
        .eq("user_id", sessionData.session?.user.id)
        .order("score", { ascending: false });
      if (data) setHighScore(data[0] as unknown as Game);
      else Alert.alert("Error", error?.message);
    };
    if (sessionData.hasSession) fetchHighScore();
  }, []);
  return (
    <Animated.View
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      className="absolute top-0 left-0 h-screen w-screen z-50 flex bg-platinum/10"
    >
      <View
        style={{
          boxShadow: "4px 4px #0074d9",
        }}
        className="bg-night w-3/4 h-fit rounded-2xl p-6 m-auto"
      >
        <Text
          style={{
            textShadowColor: "#ef4444",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
          }}
          className="text-platinum text-5xl font-bold text-center"
        >
          Game Over
        </Text>
        {game.answer && (
          <Text className="text-platinum text-center text-xl font-bold">
            The answer was{" "}
            <Text
              style={{
                textShadowColor: "#0074d9",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 2,
              }}
            >
              {game.answer}
            </Text>
          </Text>
        )}
        <Text className="text-platinum text-2xl font-bold text-center mt-6 mb-3">
          Score
        </Text>
        <View className="flex flex-row mx-auto justify-around w-full bg-gree">
          <View className="flex flex-col gap-0">
            <Text
              style={
                highScore && highScore.score == game.score
                  ? {
                      textShadowColor: "#22c55e",
                      textShadowOffset: { width: 3, height: 3 },
                      textShadowRadius: 4,
                    }
                  : {}
              }
              className="text-platinum text-5xl font-bold text-center"
            >
              {game.score}
            </Text>
            <Text className="text-platinum text-2xl font-bold text-center">
              Score
            </Text>
          </View>
          <View className="flex flex-col gap-0">
            <Text className="text-platinum text-5xl font-bold text-center">
              {game.time}
            </Text>
            <Text className="text-platinum text-2xl font-bold text-center">
              Time
            </Text>
          </View>
          <View className="flex flex-col gap-0">
            <Text className="text-platinum text-5xl font-bold text-center">
              {game.lives}
            </Text>
            <Text className="text-platinum text-2xl font-bold text-center">
              Lives
            </Text>
          </View>
        </View>
        {highScore ? (
          <View className="flx justify-center">
            <View className="flex flex-row mx-auto justify-around w-full mt-3 gap-0">
              <Text className="text-platinum text-5xl font-bold text-center">
                {highScore.score}
              </Text>
              <Text className="text-platinum text-5xl font-bold text-center">
                {highScore.time}
              </Text>
              <Text className="text-platinum text-5xl font-bold text-center">
                {highScore.lives}
              </Text>
            </View>
            <Text className="text-platinum text-2xl font-bold text-center">
              High Score
            </Text>
          </View>
        ) : sessionData.hasSession ? (
          <Text
            style={{
              textShadowColor: "#ef4444",
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
            }}
            className="text-platinum text-xl font-bold text-center"
          >
            You have no highscore yet!
          </Text>
        ) : (
          <Text className="text-platinum text-2xl font-bold text-center mt-8">
            <Link replace href={"/auth"} className="underline">
              Login or Sign Up
            </Link>{" "}
            to show your highscores!
          </Text>
        )}
        <View className="flex flex-row justify-center mt-4">
          <TouchableOpacity
            className="bg-platinum/10  w-32 mx-auto py-3 mt-6 rounded-2xl"
            style={{
              boxShadow: "4px 4px #22c55e",
            }}
            onPress={onRestart}
          >
            <Text className="text-platinum bg-red m-auto font-bold text-center text-2xl">
              Restart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-platinum/10  w-32 mx-auto py-3 mt-6 rounded-2xl"
            style={{
              boxShadow: "4px 4px #ef4444",
            }}
            onPress={onQuit}
          >
            <Text className="text-platinum m-auto font-bold text-center text-2xl">
              Quit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
