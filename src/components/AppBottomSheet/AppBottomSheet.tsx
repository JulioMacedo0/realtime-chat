import React, {
  useCallback,
  forwardRef,
  useMemo,
  useState,
  useRef,
} from "react";
import { StyleSheet, useColorScheme } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandle,
} from "@gorhom/bottom-sheet";
import { BottomSheetButton } from "../BottomSheetButton";
import { IconApp } from "../IconApp/IconApp";
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types";
import { Colors } from "@/constants/Colors";
import * as MediaLibrary from "expo-media-library";
import { GalleryBottomSheet } from "../GalleryBottomSheet";
import { FadeInDown, FadeOut, useSharedValue } from "react-native-reanimated";

import { AnimatedScrollView } from "@/constants/AnimatedComponents";
import { generateSnapPoints } from "@/helpers/generateSnapPoints";

type Props = {};

export const AppBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [showFooterComponent, setShowFooterComponet] = useState(true);
  const colorScheme = useColorScheme();
  const animatedPosition = useSharedValue(0);

  const isBottomFullScreen = useRef(false);

  const snapPoints = useMemo(() => generateSnapPoints(55, 90, 1), []);

  const animatedConfig = {
    damping: 22,
    stiffness: 360,
    velocity: 1,
  };

  const handleSheetChanges = useCallback((currenIndex: number) => {
    if (currenIndex == 35) {
      isBottomFullScreen.current = true;
      setShowFooterComponet(true);
    } else {
      isBottomFullScreen.current = false;
      setShowFooterComponet(false);
    }
    console.log("handleSheetChanges", currenIndex);
  }, []);

  const FooterComponent = useCallback(
    ({ ...props }: BottomSheetFooterProps) => {
      return (
        <BottomSheetFooter {...props}>
          <AnimatedScrollView
            entering={FadeInDown}
            exiting={FadeOut}
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
          </AnimatedScrollView>
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
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleComponent={HandleComponent}
      backdropComponent={BackdropComponent}
      footerComponent={showFooterComponent ? undefined : FooterComponent}
      activeOffsetX={[-999, 999]}
      activeOffsetY={isBottomFullScreen.current ? [-999, 999] : [-15, 15]}
      // animationConfigs={animatedConfig}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
          },
        ]}
      >
        <GalleryBottomSheet
          pointerEvents={isBottomFullScreen.current ? "auto" : "none"}
          scrollEventThrottle={16}
          bounces={false}
          alwaysBounceVertical={false}
          bouncesZoom={false}
          scrollEnabled={isBottomFullScreen.current}
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
