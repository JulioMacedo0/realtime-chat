import { VisionCamera } from "@/components/VisionCamera";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Camera() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <VisionCamera />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
