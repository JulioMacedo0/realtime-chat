import { ThemedText } from "@/components/ThemedText";
import { format } from "date-fns";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
type Props = {
  date: string;
  userId: string;
  style?: StyleProp<TextStyle>;
};

export const DateMessage = ({ date, userId, style }: Props) => {
  return (
    <ThemedText
      style={[
        styles.messageDate,
        {
          color: "#fff",
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
