import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Localizations } from "../utils/Localizations";

type HoloTextProps = {
  children: string; // Ensure children is a string for animation purposes
  className?: string;
  fontSize?: number;
  textColor?: string;
};

export default function HoloText({
  children,
  className,
  textColor = "#0074d9",
}: HoloTextProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Automatically calculate the width and height of the container
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  let { width, height } = dimensions;

  if (children == Localizations.features && window.innerWidth < 768)
    width = width * 1.75;
  else if (children == "Velox" && window.innerWidth < 768) width = width * 1.3;

  return (
    <svg
      ref={containerRef}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {width > 0 &&
        Array.from({ length: 5 }, (_, i) => (
          <motion.text
            key={`${i}-${i}`}
            x={width / 2 - 10}
            y={height * 0.95}
            className="m-auto"
            textAnchor="middle"
            stroke={textColor}
            fill={textColor}
            transform={`translate(${i * 3}, 0)`}
            opacity={1 - i * 0.2}
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: i * 4, opacity: 1 - i * 0.2 }}
            transition={{
              delay: 0.3 + (i * 0.05 + i * 0.02),
              duration: 1,
              ease: "easeOut",
            }}
          >
            {children}
          </motion.text>
        ))}
    </svg>
  );
}
