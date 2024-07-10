import { ContentMessagePayload } from "@/@types/types";
import { View, StyleSheet } from "react-native";
import { MessageText } from "./MessageText";
import { DateMessage } from "./DateMessage";
type Props = {
  message: ContentMessagePayload;
};
export const OnlyMessage = ({ message }: Props) => {
  return (
    <View style={styles.messageContainer}>
      <MessageText userId={message.user.id} text={message.content.message} />
      <DateMessage userId={message.user.id} date={message.content.date} />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
