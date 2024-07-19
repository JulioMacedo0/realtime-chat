import React, { useCallback, forwardRef, useMemo, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandle,
} from "@gorhom/bottom-sheet";
import { BottomSheetButton } from "./BottomSheetButton";
import { IconApp } from "./IconApp/IconApp";
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { GalleryBottomSheet } from "./GalleryBottomSheet";
import { useSharedValue } from "react-native-reanimated";
import { VisionCamera } from "./VisionCamera";

type Props = {};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [bottomFullScreen, setBottomFullScreen] = useState(false);
  const [scrollOnTop, setScrollOnTop] = useState(true);
  const colorScheme = useColorScheme();
  const animatedPosition = useSharedValue(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOnTop(offsetY === 0);
  };

  const snapPoints = useMemo(() => ["55%", "90%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index == 1) {
      setBottomFullScreen(true);
    } else {
      setBottomFullScreen(false);
    }
    console.log("handleSheetChanges", index);
  }, []);

  const FooterComponent = useCallback(
    ({ ...props }: BottomSheetFooterProps) => {
      return (
        <BottomSheetFooter {...props}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingVertical: 6,

              backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
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
            <BottomSheetButton
              isSelected
              name="Music"
              bgIconColor="#ff6961"
              style={{
                marginRight: 0,
              }}
              Icon={
                <IconApp
                  size={30}
                  lib="AntDesign"
                  name="caretright"
                  color="#fff"
                />
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
      animatedPosition={animatedPosition}
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleComponent={HandleComponent}
      backdropComponent={BackdropComponent}
      footerComponent={bottomFullScreen ? undefined : FooterComponent}
      activeOffsetX={[-999, 999]}
      activeOffsetY={
        bottomFullScreen ? [-999, scrollOnTop ? 0 : 999] : [-15, 15]
      }
      animationConfigs={{
        damping: 22,
        stiffness: 360,
        velocity: 1,
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
        <VisionCamera animatedPosition={animatedPosition} />
        <GalleryBottomSheet
          scrollEnabled={bottomFullScreen}
          onScroll={handleScroll}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});
