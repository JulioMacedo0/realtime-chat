import React, { useRef, useState } from "react";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { NoCameraErrorView } from "./NoCameraErrorView";
import { IconApp } from "./IconApp/IconApp";
import { VerticalFlashModeCarrousel } from "./VerticalFlashModeCarrousel";
import { router } from "expo-router";
import { FlashMode } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { Portal } from "@gorhom/portal";

type Props = {
  animatedPosition: SharedValue<number>;
};
export const VisionCamera = ({ animatedPosition }: Props) => {
  const device = useCameraDevice("back");
  if (device == null) return <NoCameraErrorView />;

  const { top } = useSafeAreaInsets();
  const camera = useRef<Camera>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const { width, height } = useWindowDimensions();
  const itemSize = width / 3 - 5;
  const expanded = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(expanded.value ? width : itemSize),
      height: withTiming(expanded.value ? height : itemSize),
      position: "absolute",
      top: expanded.value ? animatedPosition.value : "auto",
      left: expanded.value ? 0 : "auto",
      zIndex: expanded.value ? 999 : 0,
    };
  });

  const toggleExpand = () => {
    expanded.value = !expanded.value;
  };

  return (
    <Portal>
      <Animated.View style={[styles.cameraContainer, animatedStyle]}>
        <TouchableOpacity style={styles.cameraTouchArea} onPress={toggleExpand}>
          <View style={[styles.header, { top: top }]}>
            <TouchableOpacity onPress={goBack}>
              <IconApp lib="AntDesign" name="close" color="#fff" />
            </TouchableOpacity>
            <VerticalFlashModeCarrousel
              onChange={(flashmode) => {
                setFlashMode(flashmode);
              }}
            />
          </View>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
          />
        </TouchableOpacity>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    zIndex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    zIndex: 2,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    width: "100%",
  },
  cameraTouchArea: {
    flex: 1,
  },
});
