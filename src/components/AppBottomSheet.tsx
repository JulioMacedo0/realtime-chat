import React, { useCallback, forwardRef, useMemo } from "react";
import { Text, StyleSheet, View, Button, useColorScheme } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetHandle,
} from "@gorhom/bottom-sheet";
import { BottomSheetButton } from "./BottomSheetButton";
import { IconApp } from "./IconApp/IconApp";
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { VisionCamera } from "./VisionCamera";

type Props = {};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  const colorScheme = useColorScheme();

  const snapPoints = useMemo(() => ["55%", "90%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const FooterComponent = useCallback(
    ({ ...props }: BottomSheetFooterProps) => {
      return (
        <BottomSheetFooter {...props}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingVertical: 6,
              backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              flex: 1,
              borderTopColor: "#ccc",
              borderTopWidth: 0.8,
            }}
          >
            <BottomSheetButton
              isSelected
              name="Gallery"
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
              name="Wallet"
              bgIconColor="#24A1DE"
              Icon={
                <IconApp size={30} lib="Ionicons" name="wallet" color="#fff" />
              }
            />
            <BottomSheetButton
              isSelected
              name="File"
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
              name="Location"
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
              name="Contact"
              bgIconColor="#FFD700"
              Icon={
                <IconApp size={30} lib="FontAwesome" name="user" color="#fff" />
              }
            />
          </ScrollView>
        </BottomSheetFooter>
      );
    },
    [colorScheme]
  );
  const HandleComponent = useCallback(
    ({ style, indicatorStyle, ...props }: BottomSheetDefaultHandleProps) => {
      return (
        <BottomSheetHandle
          {...props}
          style={[
            style,
            {
              backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            },
          ]}
          indicatorStyle={[
            indicatorStyle,
            {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
          ]}
        />
      );
    },
    [colorScheme]
  );
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
      handleComponent={HandleComponent}
      backdropComponent={BackdropComponent}
      footerComponent={FooterComponent}
      animationConfigs={{
        damping: 16,
        stiffness: 180,
      }}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
          },
        ]}
      >
        <View
          style={{
            width: 120,
            height: 120,
          }}
        >
          <VisionCamera />
        </View>
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
    padding: 12,
    borderRadius: 16,
  },
});
