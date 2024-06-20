import { Todo } from "@/app/(tabs)/todo";
import { ThemedView } from "./ThemedView";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { IconApp } from "@/components/IconApp/IconApp";
import { useState } from "react";

interface Props {
  todo: Todo;
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function TodoCard({ todo, onEdit, onDelete }: Props) {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].tint },
      ]}
    >
      <ThemedText style={[styles.title]} type="subtitle">
        {todo.title}
      </ThemedText>
      <View style={[styles.iconContainer]}>
        <TouchableOpacity onPress={onEdit}>
          <IconApp lib="Ionicons" name="pencil" color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <IconApp lib="Ionicons" name="trash" color="#ff0000" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    padding: 8,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
