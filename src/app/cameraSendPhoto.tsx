import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { IconApp } from "@/components";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { USER_ID, supabase } from "@/supabase/supabase";
import * as Crypto from "expo-crypto";
import { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ContentPayload, ContentType } from "@/@types/types";
import { useMessagesActions } from "@/store/messageStore";
import { getFileExtension } from "@/helpers/getFileExtension";
import { getFileNameWithExtension } from "@/helpers/getFileNameWithExtension";
import { getContentType } from "@/helpers/getContentType";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { decode } from "base64-arraybuffer";
import { StackActions } from "@react-navigation/native";
import { z } from "zod";
import { useTypedLocalSearchParams } from "@/hooks/useTypedLocalSearchParams";

export default function CameraSendPhoto() {
  const { uri, height, width } = useTypedLocalSearchParams(
    z.object({
      width: z.coerce.number(),
      height: z.coerce.number(),
      uri: z
        .string({ required_error: "uri value is missing" })
        .trim()
        .min(1, "uri value missing"),
    })
  );

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessagesActions();
  const colorScheme = useColorScheme();
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const onSubmit: SubmitHandler<ContentPayload> = async (message) => {
    let url = "";
    setLoading(true);
    const newWidth = 436;
    const newHeight = newWidth * (height / width);
    const previewImg = await manipulateAsync(
      uri,
      [
        {
          resize: {
            width: newWidth,
            height: newHeight,
          },
        },
      ],
      {
        compress: 0.1,
        format: SaveFormat.JPEG,
        base64: true,
      }
    );

    const fileExtension = getFileExtension(previewImg.uri);
    const fileName = getFileNameWithExtension(previewImg.uri);
    const contentType = getContentType(fileExtension);
    const base64 = previewImg.base64;
    if (!base64) throw "Invalid base64";

    try {
      const id = Crypto.randomUUID();

      const { data, error } = await supabase.storage
        .from("realtimechat")
        .upload(`chat/preview_${fileName}`, decode(base64), {
          cacheControl: "3600",
          upsert: false,
          contentType: contentType,
        });

      if (!error) {
        url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/${process.env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET}/${data.path}`;
      }

      const now = new Date();

      const payload: ContentPayload = {
        content: {
          ...message.content,
          id,
          type: ContentType.photo,
          previewUrl: url,
          date: now.toISOString(),
          meta: {
            localUri: uri,
          },
        },
        user: { ...message.user },
      };

      addMessage(payload);
      console.log(url);
      reset();
      setLoading(false);
      navigation.dispatch(StackActions.pop(2));
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
  } = useForm<ContentPayload>({
    defaultValues: {
      content: {
        message: "",
      },
      user: {
        id: USER_ID,
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

        <Image source={uri} style={styles.photo} />
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
          disabled={loading}
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
