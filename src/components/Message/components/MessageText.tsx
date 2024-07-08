import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleProp, TextStyle } from "react-native";
type Props = {
  isUserMessage: boolean;
  text: string;
  style?: StyleProp<TextStyle>;
};
export const MessageText = ({ isUserMessage, text, style }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <ThemedText
      style={[
        {
          color: isUserMessage ? "#fff" : Colors[colorScheme ?? "light"].text,
        },
        style,
      ]}
    >
      {text}
    </ThemedText>
  );
};
