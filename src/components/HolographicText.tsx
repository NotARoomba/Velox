import { View, Text } from "react-native";

export default function HolographicText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <View className={className}>
      <View className={"relative mx-auto "}>
        {Array(5)
          .fill("")
          .map((_, i) => (
            <Text
              key={i}
              className="absolute font-bold text-8xl text-celtic_blue"
              style={{
                transform: [{ translateX: i * 3 }],
                opacity: 1 - i * 0.2,
              }}
            >
              {children}
            </Text>
          ))}
      </View>
    </View>
  );
}
