import { ContentPayload, ContentPhotoPayload } from "@/@types/types";
import { ImagePreview } from "./ImagePreview";
import { ImageOriginal } from "./ImageOriginal";
import { USER_ID, supabase } from "@/supabase/supabase";
import { useStorageUpload } from "@/hooks/useStorageUpload";
import { View, StyleSheet, Text } from "react-native";
import { MessageText } from "./MessageText";
import { DateMessage } from "./DateMessage";
import { formatBytes } from "@/helpers/formatBytes";
import { hexdecimalWithAlpha } from "@/helpers/hexdecimalWithAlpha";
import { useEffect, useState } from "react";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { IconApp } from "@/components/IconApp/IconApp";
import { AnimatedTouchableOpacity } from "@/constants/AnimatedComponents";

type Props = {
  message: ContentPhotoPayload;
};
const sendContentPhotoPayload = async (payload: ContentPhotoPayload) => {
  const resp = await supabase.channel("public:chat").send({
    type: "broadcast",
    event: "message",
    payload,
  });

  return resp;
};

export const PhotoMessageLocal = ({ message }: Props) => {
  const {
    startUpload,
    stopUpload,
    bytesTotal,
    bytesUploaded,
    onLoading,
    uploadSuccess,
    uploadUrl,
  } = useStorageUpload({
    bucketName: "realtimechat",
    uri: message.content.meta.localUri,
  });

  useEffect(() => {
    if (!uploadUrl) return;
    sendContentPhotoPayload({
      ...message,
      content: {
        ...message.content,
        url: uploadUrl,
      },
    });
  }, [uploadUrl]);

  return (
    <View>
      <ImageOriginal
        source={message.content.meta.localUri}
        blurRadius={!uploadSuccess ? 1 : 0}
      />

      {message.content.message ? (
        <View style={styles.messageContainer}>
          <MessageText
            userId={message.user.id}
            text={message.content.message}
          />
          <DateMessage userId={message.user.id} date={message.content.date} />
        </View>
      ) : (
        <DateMessage
          style={{
            position: "absolute",
            bottom: 0,
            right: 5,
            color: "#fff",
          }}
          userId={message.user.id}
          date={message.content.date}
        />
      )}

      {!uploadSuccess && (
        <AnimatedTouchableOpacity
          onPress={() => {
            startUpload();
          }}
          entering={ZoomIn}
          exiting={ZoomOut}
          style={[
            {
              flexDirection: "row",
              position: "absolute",
              alignSelf: "center",
              alignItems: "center",
              top: 0,
              bottom: 0,
            },
          ]}
        >
          <View
            style={{
              gap: 4,
              flexDirection: "row",
              padding: 8,
              borderRadius: 15,
              backgroundColor: hexdecimalWithAlpha({ alpha: 0.4, hex: "#000" }),
            }}
          >
            {onLoading ? (
              <Text style={[styles.text]}>
                {formatBytes(bytesTotal)}/{formatBytes(bytesUploaded)}
              </Text>
            ) : (
              <IconApp
                lib="Ionicons"
                name="cloud-upload-outline"
                color="#fff"
              />
            )}
          </View>
        </AnimatedTouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
  },
});
