import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";

export const OTHER_COLORS = ["#0074d9", "#7499fd", "#D7263D", "#1B998B"];
export default function Letters() {
  const letters = [..."/?<>⋅=+÷^*!±√Δ∞∑φπ∏∝∫"];
  const [height, setHeight] = useState(0);

  // Dynamically calculate the height of the document
  useLayoutEffect(() => {
    function updateSize() {
      setHeight(document.body.scrollHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <ul
      className="absolute m-0 top-0 left-0 overflow-x-hidden overflow-y-hidden w-full -z-10 dark:bg-night bg-platinum"
      style={{ height: `${height}px` }}
    >
      {[...Array(50)].map((_v, i) => {
        const wh = Math.floor(Math.random() * 131) + 60; // Random size for letters
        const randomColor =
          OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)];
        const randomLetter =
          letters[Math.floor(Math.random() * letters.length)];
        const delay = Math.floor(Math.random() * 8); // Random delay
        const duration = Math.floor(Math.random() * 51) + 10; // Random duration

        return (
          <motion.li
            key={i}
            className="absolute flex list-none align-middle justify-center text-8xl w-5 h-5 -bottom-48"
            style={{
              left: `${Math.floor(Math.random() * 111) - 10}%`,
              color: randomColor,
              width: wh,
              height: wh,
            }}
            initial={{
              y: "0%",
              rotate: 0,
              opacity: 0.4,
              borderRadius: "0%",
            }}
            animate={{
              y: "-1000%",
              rotate: 720,
              opacity: 0,
              borderRadius: "50%",
            }}
            transition={{
              delay,
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {randomLetter}
          </motion.li>
        );
      })}
    </ul>
  );
}
