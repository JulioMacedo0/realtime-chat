import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { USER_ID } from "@/supabase/supabase";
import { StyleProp, TextStyle } from "react-native";
type Props = {
  userId: string;
  text: string;
  style?: StyleProp<TextStyle>;
};
export const MessageText = ({ userId, text, style }: Props) => {
  const colorScheme = useColorScheme();
  const isUserMessage = userId == USER_ID;
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
