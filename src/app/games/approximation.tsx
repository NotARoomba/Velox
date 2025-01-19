import GameInfo from "@/src/components/GameInfo";
import { Difficulty, GameType } from "@/src/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Alert, GestureResponderEvent } from "react-native";
import Slider from "@react-native-community/slider";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";
import ApproxSlider from "@/src/components/ApproxSlider";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import GameOverModal from "@/src/components/GameOverModal";
import { supabase } from "@/src/utils/supabase";

export default function Approximation() {
  const params = useLocalSearchParams();
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // Adjust for difficulty
  const [guessed, setGuessed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [equation, setEquation] = useState<[string, number]>(["", 0]);
  useEffect(() => {
    if (params.difficulty === "Easy") {
      setTimeLeft(60);
    } else if (params.difficulty === "Medium") {
      setTimeLeft(120);
    } else if (params.difficulty === "Hard") {
      setTimeLeft(180);
    }
  }, []);
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(async () => {
        if (timeLeft <= 0) {
          setGameOver(true);
          const { error } = await supabase.from("games").insert({
            type: GameType.APPROXIMATION,
            score: guessed,
            lives,
            time: timeLeft,
          });
          if (error) Alert.alert("Error", error.message);
          // return Alert.alert("Game Over", "You ran out of time!", [
          //   {
          //     style: "default",
          //     text: "Ok",
          //     onPress: () => router.dismissTo("/play"),
          //   },
          // ]);
        }
        setTimeLeft((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  const checkAnswer = async (approxGuess: boolean) => {
    if (approxGuess) {
      setGuessed((guessed) => guessed + 1);
      setEquation(generateEquation(params.difficulty as Difficulty));
    } else {
      setLives((lives) => lives - 1);
      setEquation(generateEquation(params.difficulty as Difficulty));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      if (lives <= 1) {
        setGameOver(true);
        const { error } = await supabase.from("games").insert({
          type: GameType.APPROXIMATION,
          score: guessed,
          lives,
          time: timeLeft,
        });
        if (error) Alert.alert("Error", error.message);
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

  useEffect(() => {
    const eqa = generateEquation(params.difficulty as Difficulty);
    setEquation(eqa);
  }, []);
  return (
    <View className="h-full bg-transparent flex">
      <GameInfo lives={lives} timeLeft={timeLeft} guessed={guessed} />
      <View className="flex flex-col gap-y-8 m-auto justify-center">
        <Text className="text-platinum text-3xl font-bold mx-auto text-center">
          Solve the following equation:
        </Text>
        <Animated.View
          key={equation[0]}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
        >
          <MathJaxSvg
            style={{ marginHorizontal: "auto" }}
            fontSize={36}
            color="white"
            fontCache={true}
          >
            {equation[0]}
          </MathJaxSvg>

          {/* add a slider that at the ends are 2 numbers randomly between 3-10 of the answer */}

          <ApproxSlider
            inputNumber={equation[1]}
            onRelease={checkAnswer}
            difficulty={params.difficulty as Difficulty}
          />
        </Animated.View>
      </View>
      {gameOver && (
        <GameOverModal
          game={{
            type: GameType.APPROXIMATION,
            lives,
            time: timeLeft,
            score: guessed,
            answer: equation[1],
          }}
          onQuit={() => router.dismissTo("/play")}
          onRestart={() => {
            setLives(3);
            setTimeLeft(60);
            setGuessed(0);
            setGameOver(false);
            setEquation(generateEquation(params.difficulty as Difficulty));
          }}
        />
      )}
    </View>
  );
}

function generateEquation(difficulty: Difficulty): [string, number] {
  switch (difficulty) {
    case Difficulty.EASY:
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const operations = ["+", "-", "*", "/"];
      const operation =
        operations[Math.floor(Math.random() * operations.length)];
      let equation: string;
      let answer: number;
      if (operation === "+") {
        equation = `${a} + ${b}`;
        answer = a + b;
      } else if (operation === "-") {
        equation = `${a} - ${b}`;
        answer = a - b;
      } else if (operation === "*") {
        equation = `${a} \\times ${b}`;
        answer = a * b;
      } else {
        const b = Math.floor(Math.random() * 10) + 1;
        equation = `\\frac{${a}}{${b}}`;
        answer = a / b;
      }
      return [`$$${equation}$$`, answer];

    case Difficulty.MEDIUM:
      let c = Math.floor(Math.random() * 20) + 10;
      const d = Math.floor(Math.random() * 20) + 10;
      const complexOperation = Math.random() > 0.5 ? "*" : "/";
      if (complexOperation === "/") c *= Math.floor(Math.random() * 16) + 4;
      const equationMedium =
        complexOperation === "*" ? `${c} \\times ${d}` : `\\frac{${c}}{${d}}`;
      const answerMedium = complexOperation === "*" ? c * d : c / d;
      return [`$$${equationMedium}$$`, answerMedium];

    case Difficulty.HARD:
      const num = Math.floor(Math.random() * 100) + 1;
      const equationType = Math.random() > 0.5 ? "sqrt" : "trig";
      if (equationType === "sqrt") {
        return [`$$\\sqrt{${num}}$$`, Math.sqrt(num)];
      } else {
        const angles = [0, 30, 45, 60, 90];
        const trigFunctions = ["sin", "cos", "tan"];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        const trigFunction =
          trigFunctions[Math.floor(Math.random() * trigFunctions.length)];
        return [
          `$$${trigFunction}(${angle}^\\circ)$$`,
          (trigFunction == "sin"
            ? Math.sin
            : trigFunction == "cos"
              ? Math.cos
              : Math.tan)(angle * (Math.PI / 180)),
        ];
      }

    default:
      throw new Error("Invalid difficulty level");
  }
}
