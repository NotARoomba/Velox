import Keypad from "@/src/components/buttons/Keypad";
import Lives from "@/src/components/ui/Lives";
import { PI_DIGITS } from "@/src/utils/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Alert, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import CurvedText from "@/src/components/effects/CurvedText";
import GameInfo from "@/src/components/ui/GameInfo";
import * as Haptics from "expo-haptics";
import GameOverModal from "@/src/components/screens/GameOverModal";
import { GameType, Difficulty } from "@/src/utils/types";
import { supabase } from "@/src/utils/supabase";
import useFade from "@/src/hooks/useFade";
import { useSession } from "@/src/hooks/useSession";
import { useSettings } from "@/src/hooks/useSettings";
import { useTranslation } from "react-i18next";
import useInterval from "@/src/hooks/useInterval";
import { Tables } from "@/database.types";

export default function PI() {
  const params = useLocalSearchParams();
  const { session, hasSession } = useSession();
  const [currentIndex, setCurrentIndex] = useState(2); // Start after "3."
  const [guessed, setGuessed] = useState("3.");
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // Adjust for difficulty
  const rotation = useSharedValue(-120); // For circle rotation
  const [radius, setRadius] = useState(100); // For circle expansion
  const circleRadius = useSharedValue(100);
  const [gameOver, setGameOver] = useState(false);
  const { theme } = useSettings();
  const { t } = useTranslation();
  const [waiting, setWaiting] = useState(false);
  const [multiplayer, setMultiplayer] = useState<{
    score: number;
    lives: number;
  }>();

  // Set difficulty-dependent settings
  useEffect(() => {
    if (params.multiplayer === "1") {
      setMultiplayer({
        score: 0,
        lives: 3,
      });
      setWaiting(params.join === "0");
      // Subscribe to updates for the multiplayer game
      const playerChannel = supabase
        .channel(params.code + "_players")
        .on(
          "postgres_changes",
          {
            schema: "public",
            table: "multiplayer_players",
            filter: `code=eq.${params.code}`,
            event: "UPDATE",
          },
          async (payload: any) => {
            const data = payload.new;

            // Get the user's index from the players array
            if (data.user_id === session?.user.id) return;
            // Update the multiplayer state
            setMultiplayer({
              score: data.score,
              lives: data.lives,
            });
          }
        )
        .subscribe();
      const gameChannel = supabase
        .channel(params.code + "_game")
        .on(
          "postgres_changes",
          {
            schema: "public",
            table: "multiplayer_games",
            filter: `code=eq.${params.code}`,
            event: "UPDATE",
          },
          (payload: any) => {
            const data = payload.new;
            if (!("end" in payload.old) || params.join == "1") {
              setWaiting(false);
              const timestamp = new Date().getTime();
              setTimeLeft(
                Math.floor(
                  (new Date(data.end as unknown as string).getTime() -
                    timestamp) /
                    1000
                )
              );
            }
            if (data.is_over) {
              setGameOver(true);
            }
          }
        )
        .subscribe();

      // Cleanup subscription
      return () => {
        playerChannel.unsubscribe();
        gameChannel.unsubscribe();
      };
    } else {
      if (parseInt(params.difficulty as string) === Difficulty.EASY) {
        setTimeLeft(60);
      } else if (parseInt(params.difficulty as string) === Difficulty.MEDIUM) {
        setTimeLeft(40);
      } else if (parseInt(params.difficulty as string) === Difficulty.HARD) {
        setTimeLeft(30);
      }
    }
  }, []);
  useInterval(() => {
    if (timeLeft > 0 && !gameOver) setTimeLeft((time) => time - 1);
    else if (!gameOver && timeLeft == 0) setGameOver(true);
  }, 1000);
  useEffect(() => {
    if (gameOver && hasSession && params.multiplayer == "0") {
      supabase
        .from("games")
        .insert({
          type: GameType.PI,
          score: guessed.length - 2,
          lives,
          time: timeLeft,
        })
        .then(({ error }) => {
          if (error) Alert.alert(t("error"), error.message);
        });
    }
  }, [gameOver]);

  // Handle user guess
  const handleGuess = async (input: string) => {
    if (gameOver) return;
    const correctDigit = PI_DIGITS[currentIndex];
    if (input === correctDigit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Update guessed digits and index
      setGuessed((prev) => prev + correctDigit);
      setCurrentIndex((prev) => prev + 1);
      if (params.multiplayer == "1")
        await supabase
          .from("multiplayer_players")
          .update({ score: guessed.length - 1 })
          .match({ code: params.code, user_id: session?.user.id });
      // Animate circle rotation
      rotation.value = withSpring(
        rotation.value + -360 / (19 * (-rotation.value / 179))
      ); // Rotate for each correct guess and scale logarithmically
      // console.log(rotation.value);
      // Increase circle radius every full rotation
      if (Math.abs(rotation.value - 38) / 360 >= 1) {
        setRadius((r) => r + 6); // Increase radius smoothly
        circleRadius.value = withSpring(circleRadius.value + 6);
      }
    } else {
      if (params.multiplayer == "1")
        await supabase
          .from("multiplayer_players")
          .update({ lives: lives - 1 })
          .match({ code: params.code, user_id: session?.user.id });
      setLives((prev) => prev - 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (lives === 1) {
        setGameOver(true);
        const { error } = await supabase.rpc("finish_multiplayer_game", {
          game_code: params.code,
        });
        if (error) Alert.alert(t("error"), error.message);
        // if (hasSession && params.multiplayer == "0") {
        //   const { error } = await supabase.from("games").insert({
        //     type: GameType.PI,
        //     score: guessed.length - 2,
        //     lives,
        //     time: timeLeft,
        //   });
        //   if (error) Alert.alert(t("error"), error.message);
        // }
        // Alert.alert("Game Over", "You ran out of lives!", [
        //   {
        //     style: "default",
        //     text: "Ok",
        //     onPress: () => router.dismissTo("/play"),
        //   },
        // ]);
      }
    }
  };

  // Animated styles for rotation
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
      width: circleRadius.value,
      height: circleRadius.value,
      borderRadius: 9999, // Keep the circle shape
    };
  });

  // Derived values for CurvedText dimensions
  // console.log(params);
  return (
    <View className="h-full bg-transparent flex items-center justify-around">
      {waiting ? (
        <View className="m-auto">
          <Text className="text-3xl font-bold text-center text-platinum">
            {t("multiplayer.waiting")}
          </Text>
          <Text className="text-xl text-center text-platinum">
            {t("multiplayer.share").split("&&")[0]}
            <Text className="font-bold text-celtic_blue">{params.code}</Text>
            {t("multiplayer.share").split("&&")[1]}
          </Text>
        </View>
      ) : (
        <>
          <GameInfo
            lives={lives}
            timeLeft={timeLeft}
            guessed={guessed.length - 2}
          />
          {params.multiplayer == "1" && !gameOver && (
            <GameInfo
              lives={multiplayer?.lives ?? 0}
              guessed={multiplayer?.score ?? 0}
            />
          )}

          {/* Rotating and Expanding Curved Text */}
          <View className="flex flex-col items-center justify-center ">
            <Animated.View
              className="flex w-full"
              style={[
                animatedStyles,
                {
                  backgroundColor: "#0074d9",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <CurvedText
                width={radius * 2}
                height={radius * 2}
                cx={radius}
                cy={radius}
                rx={radius}
                ry={radius}
                startOffset={0}
                reversed={true}
                text={guessed}
                svgProps={{
                  style: { backgroundColor: "#00000000" },
                }}
                textPathProps={null}
                textProps={{
                  style: {
                    fontSize: 60,
                    fill: theme === "dark" ? "#e8e8e8" : "#151515",
                  },
                }}
                tspanProps={null}
              />
            </Animated.View>
          </View>

          {/* Keypad */}
          <Keypad
            disabled={gameOver}
            onDigitPress={(digit) => handleGuess(digit)}
          />
          {gameOver && (
            <GameOverModal
              game={{
                type: GameType.PI,
                lives,
                time: timeLeft,
                score: guessed.length - 2,
                answer: parseInt(PI_DIGITS.at(currentIndex) ?? "0"),
              }}
              multiplayer={multiplayer}
              onQuit={() => router.dismissTo("/play")}
              onRestart={() => {
                setCurrentIndex(2);
                setGuessed("3.");
                setLives(3);
                setTimeLeft(60);
                setRadius(100);
                rotation.value = -120;
                circleRadius.value = 100;
                setGameOver(false);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
