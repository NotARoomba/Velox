import Keypad from "@/src/components/buttons/Keypad";
import Lives from "@/src/components/ui/Lives";
import { PI_DIGITS } from "@/src/utils/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Alert, Platform, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  FadeIn,
  FadeOut,
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
import GridNumber from "@/src/components/ui/GridNumber";
import MatchNumber from "@/src/components/ui/MatchNumber";
import useInterval from "@/src/hooks/useInterval";

export default function Match() {
  const params = useLocalSearchParams();
  const { hasSession } = useSession();
  const [guessed, setGuessed] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // Adjust for difficulty
  const [gameOver, setGameOver] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [alreadyGuessed, setAlreadyGuessed] = useState<number[]>([]);
  const [numberSelected, setNumberSelected] = useState<number>(0);
  const [answerSelected, setAnswerSelected] = useState<number>(0);
  const { t } = useTranslation();
  const { session } = useSession();
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
          type: GameType.MATCH,
          score: guessed,
          lives,
          time: timeLeft,
        })
        .then(({ error }) => {
          if (error) Alert.alert(t("error"), error.message);
        });
    }
  }, [gameOver]);

  useEffect(() => {
    // generate 3 numbers from 1-100 and set them as the numbers making sure not to repeat any
    const randomNumbers: number[] = [];
    while (randomNumbers.length < 3) {
      const random = Math.floor(Math.random() * 100) + 1;
      if (!randomNumbers.includes(random)) randomNumbers.push(random);
    }
    setNumbers(randomNumbers);
    setAnswers(
      randomNumbers
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
  }, []);

  useEffect(() => {
    if (numberSelected && answerSelected) {
      if (numberSelected === answerSelected) {
        if (params.multiplayer == "1")
          supabase
            .from("multiplayer_players")
            .update({ score: guessed + 1 })
            .match({ code: params.code, user_id: session?.user.id });
        setGuessed((guessed) => guessed + 1);
        setAlreadyGuessed((alreadyGuessed) => {
          // if the length of already gu
          if (alreadyGuessed.length == 0) {
            // setTimeout(() => {
            //   const nindex = numbers.indexOf(numberSelected);
            //   const aindex = answers.indexOf(answerSelected);
            //   const newNumbers = numbers;
            //   const newAnswers = answers;
            //   const newAnswer = Math.floor(Math.random() * 100) + 1;
            //   newNumbers[nindex] = newAnswer;
            //   newAnswers[aindex] = newAnswer;
            //   setAnswers(newAnswers);
            //   setNumbers(newNumbers);
            //   setAlreadyGuessed([]);
            // }, 1000);
            return [numberSelected];
          } else {
            // //find the indexes of the 2 numbers in already gusses, shuffle their number and answer indexes, and then add a new random number to the number and answer indexes, then remove the 2 numbers from already guessed
            const index1 = numbers.indexOf(alreadyGuessed[0]);
            const index2 = numbers.indexOf(numberSelected);
            const index3 = answers.indexOf(alreadyGuessed[0]);
            const index4 = answers.indexOf(answerSelected);
            const newNumbers = numbers;
            const newAnswers = answers;
            const newAnswer1 = Math.floor(Math.random() * 100) + 1;
            const newAnswer2 = Math.floor(Math.random() * 100) + 1;
            newNumbers[index1] = newAnswer1;
            newNumbers[index2] = newAnswer2;
            newAnswers[index3] = newAnswer2;
            newAnswers[index4] = newAnswer1;
            setAnswers(newAnswers);
            setNumbers(newNumbers);
            return [];
          }
        });

        setNumberSelected(0);
        setAnswerSelected(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        if (params.multiplayer == "1")
          supabase
            .from("multiplayer_players")
            .update({ lives: lives - 1 })
            .match({ code: params.code, user_id: session?.user.id });
        setLives((lives) => lives - 1);
        setNumberSelected(0);
        setAnswerSelected(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (lives === 1)
          supabase
            .rpc("finish_multiplayer_game", {
              game_code: params.code,
            })
            .then(({ error }) => {
              Alert.alert(t("error"), error?.message);
              setGameOver(true);
            });
      }
    }
  }, [numberSelected, answerSelected]);

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
          <GameInfo lives={lives} timeLeft={timeLeft} guessed={guessed} />
          {params.multiplayer == "1" && !gameOver && (
            <GameInfo
              lives={multiplayer?.lives ?? 0}
              guessed={multiplayer?.score ?? 0}
            />
          )}

          <View className="flex flex-row items-center justify-around w-full">
            {/* Numbers */}
            <View className="flex flex-col items-center justify-around gap-y-4 w-1/2">
              {numbers.map((number, i) =>
                alreadyGuessed.includes(number) ? (
                  <View
                    key={i + number}
                    // entering={FadeIn}
                    // exiting={FadeOut}
                    className="w-10/12 aspect-square flex rounded-2xl p-2  dark:bg-platinum/10 bg-night/5"
                  />
                ) : (
                  <MatchNumber
                    key={i + number}
                    number={number}
                    selected={numberSelected}
                    setSelected={setNumberSelected}
                  />
                )
              )}
            </View>

            <View className="flex flex-col items-center justify-around gap-y-4 w-1/2">
              {answers.map((number, i) =>
                alreadyGuessed.includes(number) ? (
                  <View
                    key={i + number}
                    // entering={FadeIn}
                    // exiting={FadeOut}
                    className="w-10/12 aspect-square flex rounded-2xl p-2  dark:bg-platinum/10 bg-night/5"
                  />
                ) : (
                  <GridNumber
                    key={i + number}
                    number={number}
                    selected={answerSelected}
                    setSelected={setAnswerSelected}
                  />
                )
              )}
            </View>
          </View>

          {gameOver && (
            <GameOverModal
              game={{
                type: GameType.PI,
                lives,
                time: timeLeft,
                score: guessed,
              }}
              multiplayer={multiplayer}
              onQuit={() => router.dismissTo("/play")}
              onRestart={() => {
                setGuessed(0);
                setLives(3);
                setTimeLeft(60);
                setGameOver(false);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
