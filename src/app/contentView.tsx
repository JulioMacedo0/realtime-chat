import { StyleSheet, Animated } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";

export default function ContentView() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const { imgUrl } = useLocalSearchParams();
  return (
    <SafeAreaView
      style={[styles.safeArea, { marginTop: headerHeight - insets.top }]}
    >
      <Image source={imgUrl} contentFit="contain" style={[styles.image]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent", // Match the background color of your screen
  },

  image: {
    flex: 1,
  },
});
