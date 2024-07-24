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
import { useNavigation } from "expo-router";
import { FlashMode } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Portal } from "@gorhom/portal";
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
  const isExpanded = useSharedValue(false);
  const [isExpandedState, setIsExpandedState] = useState(false);

  const collapsed = () => {
    isExpanded.value = false;
    setIsExpandedState(false);
    // if (router.canGoBack()) {
    //   router.back();
    // }
  };

  const { width, height } = useWindowDimensions();

  const itemSize = width / 3 - 5;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: 999,
      position: isExpanded.value ? "absolute" : "relative",
      width: withTiming(isExpanded.value ? width : itemSize, { duration: 500 }),
      height: withTiming(isExpanded.value ? height : itemSize, {
        duration: 500,
      }),
      left: withTiming(isExpanded.value ? 0 : 0, {
        duration: 500,
      }),
      top: withTiming(isExpanded.value ? -70 : 0, {
        duration: 500,
      }),
    };
  });

  const expanded = () => {
    isExpanded.value = true;
    setIsExpandedState(true);
    //navigation.navigate("camera");
  };

  return (
    <View style={{ width: itemSize, height: itemSize }}>
      <Animated.View style={[styles.cameraContainer, animatedStyle]}>
        {!isExpandedState && (
          <AbsoluteCenter>
            <IconApp lib="AntDesign" name="camera" size={35} color="#fff" />
          </AbsoluteCenter>
        )}
        <TouchableOpacity
          style={styles.cameraTouchArea}
          activeOpacity={isExpandedState ? 1 : 0.7}
          onPress={expanded}
        >
          {isExpandedState && (
            <View style={[styles.header, { top: top }]}>
              <TouchableOpacity onPress={collapsed}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {},
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
