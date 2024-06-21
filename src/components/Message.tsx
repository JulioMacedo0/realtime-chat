import { TMessage } from "@/app/(tabs)";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
type Props = {
  message: TMessage;
};

export function Message({ message }: Props) {
  const colorScheme = useColorScheme();
  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? "light"].bgContrast,
        },
      ]}
    >
      <ThemedText style={{ color: Colors[colorScheme ?? "light"].text }}>
        {message.user.id}
      </ThemedText>
      <ThemedText style={{ color: Colors[colorScheme ?? "light"].text }}>
        -
      </ThemedText>
      <ThemedText style={{ color: Colors[colorScheme ?? "light"].text }}>
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
    borderRadius: 12,
    marginVertical: 5,
  },
});
