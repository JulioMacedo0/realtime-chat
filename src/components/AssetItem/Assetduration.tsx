import { View, StyleSheet, Text } from "react-native";

import { hexdecimalWithAlpha } from "@/helpers/hexdecimalWithAlpha";
import { formatSecondsToMMSS } from "@/helpers/formatSecondsToMMSS";
import { IconApp } from "../IconApp/IconApp";

type Props = {
  duration: number;
};

export const AssetDuration = ({ duration }: Props) => (
  <View style={styles.container}>
    <IconApp size={12} lib="AntDesign" name="caretright" color="#fff" />
    <Text style={styles.text}>{formatSecondsToMMSS(duration)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    position: "absolute",
    left: 3,
    bottom: 3,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    borderRadius: 12,
    backgroundColor: hexdecimalWithAlpha({ hex: "#000", alpha: 0.6 }),
  },
  text: {
    color: "#fff",
    fontSize: 10,
  },
});
