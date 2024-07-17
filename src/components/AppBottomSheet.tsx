import React, { useCallback, forwardRef, useMemo } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BottomSheetButton } from "./BottomSheetButton";
import { IconApp } from "./IconApp/IconApp";

type Props = {};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  // variables
  const snapPoints = useMemo(() => ["60%", "100%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const FooterComponent = useCallback((props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter {...props}>
        <BottomSheetScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 6,
            backgroundColor: "white",
            flexDirection: "row",
            gap: 8,
            borderTopColor: "#ccc",
            borderTopWidth: 0.8,
            flex: 1,
          }}
        >
          <BottomSheetButton
            isSelected
            Name="Gallery"
            bgIconColor="#24A1DE"
            Icon={
              <IconApp
                size={30}
                lib="MaterialIcons"
                name="insert-photo"
                color="#fff"
              />
            }
          />
          <BottomSheetButton
            isSelected
            Name="Wallet"
            bgIconColor="#24A1DE"
            Icon={
              <IconApp size={30} lib="Ionicons" name="wallet" color="#fff" />
            }
          />
          <BottomSheetButton
            isSelected
            Name="File"
            bgIconColor="#24A1DE"
            Icon={
              <IconApp
                size={30}
                lib="MaterialCommunityIcons"
                name="file"
                color="#fff"
              />
            }
          />
          <BottomSheetButton
            isSelected
            Name="Location"
            bgIconColor="#50C878"
            Icon={
              <IconApp
                size={30}
                lib="MaterialIcons"
                name="location-on"
                color="#fff"
              />
            }
          />
          <BottomSheetButton
            isSelected
            Name="Contact"
            bgIconColor="#FFD700"
            Icon={
              <IconApp size={30} lib="FontAwesome" name="user" color="#fff" />
            }
          />
        </BottomSheetScrollView>
      </BottomSheetFooter>
    );
  }, []);

  const BackdropComponent = useCallback(
    ({ style, ...props }: BottomSheetBackdropProps) => {
      return (
        <BottomSheetBackdrop
          {...props}
          style={[style]}
          opacity={0.1}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      );
    },
    []
  );
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={BackdropComponent}
      footerComponent={FooterComponent}
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
