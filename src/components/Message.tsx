import { TMessage } from "@/app/(tabs)";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type Props = {
  message: TMessage;
};

export function Message({ message }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ color: "#000" }}>{message.user.id}</ThemedText>
      <ThemedText style={{ color: "#000" }}>-</ThemedText>
      <ThemedText style={{ color: "#000" }}>
        {message.content.message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
  },
});
