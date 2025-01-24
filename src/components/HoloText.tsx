import { HoloTextProps } from "../utils/types";
import Svg, { Text } from "react-native-svg";

export default function HoloText({
  children,
  width,
  height,
  style,
  className,
  fontSize = 36,
  textColor = "#0074d9",
}: HoloTextProps) {
  return (
    <Svg
      width={width}
      height={height}
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Text
          key={i}
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight={700}
          stroke={textColor}
          fill={textColor}
          translateX={i * 3}
          opacity={1 - i * 0.2}
        >
          {children}
        </Text>
      ))}
    </Svg>
  );
}
