import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { IconApp } from "@/components";
import { router } from "expo-router";

export default function CameraSend() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.headerButtom}>
            <IconApp lib="AntDesign" name="close" color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerButtonsContainer}>
            <TouchableOpacity
              onPress={() => console.log("cliked")}
              style={styles.headerButtom}
            >
              <IconApp
                lib="MaterialCommunityIcons"
                name="crop-rotate"
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log("cliked")}
              style={styles.headerButtom}
            >
              <IconApp
                lib="MaterialCommunityIcons"
                name="format-text"
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log("cliked")}
              style={styles.headerButtom}
            >
              <IconApp lib="AntDesign" name="edit" color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source="https://picsum.photos/seed/696/3000/2000"
          style={styles.photo}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  photo: {
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
    top: 20,
  },

  headerButtom: {
    padding: 6,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 99,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
