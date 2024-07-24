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
import { router, useNavigation } from "expo-router";
import { FlashMode } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue } from "react-native-reanimated";

import { AbsoluteCenter } from "./AbsoluteCenter";

type Props = {
  sizeType: "small" | "full";
};
export const VisionCamera = ({ sizeType }: Props) => {
  const device = useCameraDevice("back");
  if (device == null) return <NoCameraErrorView />;

  const { top } = useSafeAreaInsets();
  const camera = useRef<Camera>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const navigation = useNavigation();
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const { width, height } = useWindowDimensions();

  const itemSize = width / 3 - 5;
  const expanded = useSharedValue(false);

  const goToCamera = () => {
    navigation.navigate("camera");
  };

  return (
    <Animated.View
      style={[
        styles.cameraContainer,
        {
          width: sizeType == "full" ? "100%" : itemSize,
          height: sizeType == "full" ? "100%" : itemSize,
        },
      ]}
    >
      {sizeType == "small" && (
        <AbsoluteCenter>
          <IconApp lib="AntDesign" name="camera" size={35} color="#fff" />
        </AbsoluteCenter>
      )}
      <TouchableOpacity
        style={styles.cameraTouchArea}
        activeOpacity={sizeType == "full" ? 1 : 0.7}
        onPress={sizeType == "full" ? undefined : goToCamera}
      >
        {sizeType == "full" && (
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
        )}
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={true}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    position: "relative",
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
