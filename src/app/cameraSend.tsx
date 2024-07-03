import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { IconApp } from "@/components";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { IFormInput, contentType, userID } from "./(tabs)";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "@/supabase/supabase";
import * as Crypto from "expo-crypto";
import { useState } from "react";
import { decode } from "base64-arraybuffer";
import { VideoPlayer } from "@/components/VideoPlayer";
export default function CameraSend() {
  const { imgUrl, type } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const sendMessage = async (payload: IFormInput) => {
    const resp = await supabase.channel("public:chat").send({
      type: "broadcast",
      event: "message",
      payload,
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    console.log(data.content.message);
    try {
      const fileName = imgUrl.split("/").pop();
      const fileType = fileName.split(".").pop();
      let url = "";
      const id = Crypto.randomUUID();

      const base64 = await FileSystem.readAsStringAsync(imgUrl, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (type == "photo") {
        const { data, error } = await supabase.storage
          .from("realtimechat")
          .upload(`chat/${fileName}`, decode(base64), {
            cacheControl: "3600",
            upsert: false,
            contentType: `image/${fileType}`,
            duplex: "",
          });

        if (!error) {
          url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/${process.env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET}/${data.path}`;
        }
      }

      console.log(url, "url");

      const now = new Date();

      const payload: IFormInput = {
        content: {
          ...data.content,
          id,
          type: type,
          url,
          date: now.toISOString(),
        },
        user: { ...data.user },
      };
      await sendMessage(payload);
      setLoading(false);
      reset();
      router.replace("(tabs)/");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      content: {
        message: "",
      },
      user: {
        id: userID,
      },
    },
  });

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

        {type == contentType.photo && (
          <Image source={imgUrl} style={styles.photo} />
        )}
        {type == contentType.video && <VideoPlayer uri={imgUrl} />}
      </View>
      <View style={styles.bottomContainer}>
        <View
          style={{
            marginVertical: 8,
            flex: 1,
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            borderRadius: 28,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingHorizontal: 12,
            gap: 6,
          }}
        >
          <TouchableOpacity activeOpacity={0.4}>
            <IconApp lib="FontAwesome6" name="face-laugh" color="#ccc" />
          </TouchableOpacity>
          <Controller
            control={control}
            name="content.message"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholderTextColor="#ccc"
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                placeholder="Add a legend"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                }}
                value={value}
              />
            )}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.sendButton]}
          onPress={handleSubmit(onSubmit)}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <IconApp lib="Ionicons" name={"send-sharp"} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 6,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
    paddingBottom: 8,
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
  sendButton: {
    backgroundColor: "#00af00",
    padding: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 4,
  },
});
