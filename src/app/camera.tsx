import { IconApp } from "@/components";
import {
  CameraView,
  useCameraPermissions,
  CameraNativeProps,
  CameraType,
  CameraPictureOptions,
  Camera as CameraExpo,
} from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { contentType } from "./(tabs)";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [type, setType] = useState<contentType>(contentType.photo);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);
  const animatedContentType = useSharedValue<contentType>(contentType.photo);
  const isRecoding = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    let width, height, borderRadius, backgroundColor;
    if (
      animatedContentType.value === contentType.video &&
      isRecoding.value == false
    ) {
      width = withTiming(20);
      height = withTiming(20);
      borderRadius = withTiming(99);
      backgroundColor = withTiming("#fff");
    } else if (animatedContentType.value === contentType.photo) {
      width = withTiming(30);
      height = withTiming(30);
      borderRadius = withTiming(99);
      backgroundColor = withTiming("#fff");
    } else if (
      animatedContentType.value === contentType.video &&
      isRecoding.value == true
    ) {
      width = withTiming(20);
      height = withTiming(20);
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
    setType(contentType.video);
    animatedContentType.value = contentType.video;
  };

  const setPhotoMode = () => {
    setType(contentType.photo);
    animatedContentType.value = contentType.photo;
  };

  const takePhoto = async () => {
    if (!cameraRef.current) throw "cameraRef dont exist";
    const options: CameraPictureOptions = {
      quality: 0.5,
      base64: true,
      skipProcessing: true,
    };
    const data = await cameraRef.current.takePictureAsync(options);
    console.log(data);
    router.push(`/cameraSend?imgUrl=${data?.uri}&type=${type}`);
  };

  const recordvideo = async () => {
    if (!cameraRef.current) throw "cameraRef dont exist";
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
    const data = await cameraRef.current.recordAsync();
    console.log(data?.uri);
    router.push(`/cameraSend?imgUrl=${data?.uri}&type=${type}`);
  };

  const stopRecrodVideo = () => {
    cameraRef.current?.stopRecording();
    isRecoding.value = false;
  };

  const handleCameraButton = () => {
    if (type == contentType.photo) {
      takePhoto();
    } else if (type == contentType.video && isRecoding.value == false) {
      recordvideo();
    } else if (type == contentType.video && isRecoding.value == true) {
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
        mode="video"
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <IconApp lib="AntDesign" name="close" color="#fff" />
          </TouchableOpacity>
          <IconApp lib="Ionicons" name="flash" color="#fff" />
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
                type == contentType.video ? "#25d366" : "#ffffff1A",
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
                type == contentType.photo ? "#25d366" : "#ffffff1A",
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
