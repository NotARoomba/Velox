import { motion } from "framer-motion";
import { Gamepad2, Users, Trophy, User, Globe, MoonStar } from "lucide-react";
import { OTHER_COLORS } from "./Letters";
import { Localizations } from "../utils/Localizations";

const features = [
  {
    icon: (
      <Gamepad2
        size={48}
        color={OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)]}
      />
    ),
    text: Localizations.gameModes,
  },
  {
    icon: <Users size={48} />,
    text: Localizations.multiplayer,
  },
  {
    icon: (
      <Trophy
        size={48}
        color={OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)]}
      />
    ),
    text: Localizations.leaderboard,
  },
  {
    icon: (
      <User
        size={48}
        color={OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)]}
      />
    ),
    text: Localizations.customProfile,
  },
  {
    icon: (
      <Globe
        size={48}
        color={OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)]}
      />
    ),
    text: Localizations.languages,
  },
  {
    icon: (
      <MoonStar
        size={48}
        color={OTHER_COLORS[Math.floor(Math.random() * OTHER_COLORS.length)]}
      />
    ),
    text: Localizations.darkMode,
  },
];

export default function FeatureGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
      className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6 cursor-pointer auto-rows-fr"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "4px 4px 0px #0074d9",
          }}
          className="relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg 
          bg-night/5 dark:text-platinum dark:bg-platinum/5 text-night h-full"
        >
          {feature.icon}
          <p className="text-lg mt-2 text-center font-bold">{feature.text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
