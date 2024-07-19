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
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const VisionCamera = () => {
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

  const { width } = useWindowDimensions();
  const itemSize = width / 3 - 5;

  return (
    <View
      style={{
        width: itemSize,
        height: itemSize,
      }}
    >
      <View style={[styles.header, [{ top: top }]]}>
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
        style={[styles.camera]}
        device={device}
        isActive={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
});
