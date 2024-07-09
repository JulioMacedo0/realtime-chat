import { TouchableOpacity } from "react-native";
import { IconApp } from "./IconApp/IconApp";
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
export function Camera() {
  const [permission, requestPermission] = useCameraPermissions();

  const handleCamera = async () => {
    console.log(permission);

    if (!permission?.granted) {
      const value = await requestPermission();

      if (!value.granted) {
        alert("Camera not permited");
        return;
      }
    }
    router.push("/camera");
  };

  return (
    <TouchableOpacity activeOpacity={0.4} onPress={handleCamera}>
      <IconApp lib="Feather" name="camera" color="#ccc" />
    </TouchableOpacity>
  );
}
