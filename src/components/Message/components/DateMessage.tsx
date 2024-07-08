import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { USER_ID } from "@/supabase/supabase";
import { format } from "date-fns";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
type Props = {
  date: string;
  userId: string;
  style?: StyleProp<TextStyle>;
};

export const DateMessage = ({ date, userId, style }: Props) => {
  const isUserMessage = USER_ID == userId;
  const colorScheme = useColorScheme();
  return (
    <ThemedText
      style={[
        styles.messageDate,
        {
          color: isUserMessage ? "#fff" : Colors[colorScheme ?? "light"].text,
        },
        style,
      ]}
    >
      {format(date, "HH:mm")}
    </ThemedText>
  );
};
const styles = StyleSheet.create({
  messageDate: {
    fontSize: 13,
    alignSelf: "flex-end",
    marginLeft: 4,
  },
});
