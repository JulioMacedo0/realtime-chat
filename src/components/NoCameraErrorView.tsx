import { View, Text, StyleSheet } from "react-native";

export const NoCameraErrorView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No camera detected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
  },
});
