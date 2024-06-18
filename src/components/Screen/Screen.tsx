import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";

type Props = {
  children: React.ReactNode;
};

export function Screen({ children }: Props) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
  },
  flex: {
    flex: 1,
  },
});
