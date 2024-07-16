import { View, Text, StyleSheet } from "react-native";

export const NoCameraErrorView = () => {
  return (
    <View style={styles.container}>
      <Text>No camera detected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
