import { IconApp } from "@/components";
import {
  CameraView,
  CameraType,
  CameraPictureOptions,
  Camera as CameraExpo,
  FlashMode,
  CameraMode,
} from "expo-camera";
import { router, useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { VerticalFlashModeCarrousel } from "@/components/VerticalFlashModeCarrousel";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/springUtils";
import { ContentType } from "@/@types/types";

export default function Camera() {
  const { navigate } = useNavigation();
  const springConf: SpringConfig = {
    damping: 8,
    stiffness: 150,
  };
  const [facing, setFacing] = useState<CameraType>("back");
  const [type, setType] = useState<ContentType>(ContentType.photo);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const cameraRef = useRef<CameraView | null>(null);
  const animatedContentType = useSharedValue<ContentType>(ContentType.photo);
  const isRecoding = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    let width, height, borderRadius, backgroundColor;
    if (
      animatedContentType.value === ContentType.video &&
      isRecoding.value == false
    ) {
      width = withSpring(20, springConf);
      height = withSpring(20, springConf);
      borderRadius = withSpring(99, springConf);
      backgroundColor = withTiming("#fff");
    } else if (animatedContentType.value === ContentType.photo) {
      width = withSpring(30, springConf);
      height = withSpring(30, springConf);
      borderRadius = withTiming(99);
      backgroundColor = withTiming("#fff");
    } else if (
      animatedContentType.value === ContentType.video &&
      isRecoding.value == true
    ) {
      width = withSpring(20, springConf);
      height = withSpring(20, springConf);
      borderRadius = withTiming(2);
      backgroundColor = withTiming("#ea394bff");
    }

    return {
      width,
      height,
      borderRadius,
      backgroundColor,
    };
  });

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const setVideoMode = () => {
    setType(ContentType.video);
    setCameraMode("video");
    animatedContentType.value = ContentType.video;
  };

  const setPhotoMode = () => {
    setType(ContentType.photo);
    setCameraMode("picture");
    animatedContentType.value = ContentType.photo;
  };

  const takePhoto = async () => {
    if (!cameraRef.current) throw "cameraRef dont exist";
    cameraRef.current._onCameraReady();
    try {
      const options: CameraPictureOptions = {
        quality: 0.5,
        base64: false,
        skipProcessing: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      if (!data) {
        throw "Camera data is undefined";
      }

      navigate("cameraSendPhoto", data);
    } catch (error) {
      console.error(error);
    }
  };

  const recordvideo = async () => {
    if (!cameraRef.current) throw "cameraRef dont exist";

    try {
      const microphonePermission =
        await CameraExpo.getMicrophonePermissionsAsync();
      console.log(microphonePermission);
      if (!microphonePermission.granted) {
        const permission = await CameraExpo.requestMicrophonePermissionsAsync();
        if (permission.granted == false) {
          alert("Need record audio permission");
          return;
        }
      }
      isRecoding.value = true;
      const data = await cameraRef.current.recordAsync({});
      console.log(data?.uri);
      router.push(`/cameraSendPhoto?imgUrl=${data?.uri}&type=${type}`);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecrodVideo = () => {
    cameraRef.current?.stopRecording();
    isRecoding.value = false;
  };

  const handleCameraButton = () => {
    if (type == ContentType.photo) {
      takePhoto();
    } else if (type == ContentType.video && isRecoding.value == false) {
      recordvideo();
    } else if (type == ContentType.video && isRecoding.value == true) {
      stopRecrodVideo();
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        mode={cameraMode}
        flash={flashMode}
        videoQuality="720p"
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <IconApp lib="AntDesign" name="close" color="#fff" />
          </TouchableOpacity>
          <VerticalFlashModeCarrousel
            onChange={(flashmode) => {
              setFlashMode(flashmode);
            }}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButtom}>
            <IconApp
              lib="MaterialCommunityIcons"
              name="image-outline"
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCameraButton}
            style={{
              borderColor: "#fff",
              borderWidth: 3,
              borderRadius: 99,
              width: 45,
              height: 45,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View style={animatedStyle} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButtom}
            onPress={toggleCameraFacing}
          >
            <IconApp
              lib="MaterialCommunityIcons"
              name="sync"
              color="#fff"
              style={{
                transform: [{ rotateX: "45deg" }],
              }}
            />
          </TouchableOpacity>
        </View>
      </CameraView>
      <View
        style={{
          backgroundColor: "#000",
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={[
            styles.textContainer,
            {
              backgroundColor:
                type == ContentType.video ? "#25d366" : "#ffffff1A",
            },
          ]}
          onPress={setVideoMode}
        >
          <IconApp
            lib="MaterialCommunityIcons"
            name="video"
            color={"#fff"}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.textContainer,
            {
              backgroundColor:
                type == ContentType.photo ? "#25d366" : "#ffffff1A",
            },
          ]}
          onPress={setPhotoMode}
        >
          <IconApp
            lib="MaterialCommunityIcons"
            name="camera"
            color={"#fff"}
            size={30}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    top: 20,
    width: "100%",
  },
  footer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    bottom: 20,
    width: "100%",
  },
  footerButtom: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 99,
  },
  textContainer: {
    borderRadius: 12,
    padding: 4,
  },
});
