import React, { useCallback, forwardRef, useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";

type Props = {};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  // variables
  const snapPoints = useMemo(() => ["60%"], []);

  // callbacks

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      animationConfigs={{
        damping: 16,
        stiffness: 180,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
