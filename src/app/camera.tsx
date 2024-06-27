import { IconApp } from "@/components";
import {
  CameraView,
  useCameraPermissions,
  CameraNativeProps,
  CameraType,
  CameraPictureOptions,
} from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { contentType } from "./(tabs)";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [type, setType] = useState<contentType>(contentType.photo);
  const cameraRef = useRef<CameraView | null>(null);

  console.log(type, "type");
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options: CameraPictureOptions = {
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);

      router.push(`/cameraSend?imgUrl=${data?.uri}&type=${type}`);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
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
            onPress={takePhoto}
            style={{
              borderColor: "#fff",
              borderWidth: 3,
              borderRadius: 99,
              padding: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: 30,
                height: 30,
                borderRadius: 99,
              }}
            />
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
});
