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
import { useEffect } from "react";

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

export const PhotoMessage = ({ message }: Props) => {
  const isUserMessage = message.user.id == USER_ID;

  const {
    bytesTotal,
    bytesUploaded,
    error,
    onLoading,
    startUpload,
    stopUpload,
    uploadUrl,
  } = useStorageUpload({
    bucketName: "realtimechat",
    uri: message.content.meta.localUri,
  });

  useEffect(() => {
    if (uploadUrl) {
      sendContentPhotoPayload({
        ...message,
        content: {
          ...message.content,
          url: uploadUrl,
        },
      });
    }
  }, [uploadUrl]);

  return (
    <View>
      {message.content.url ? (
        <ImageOriginal
          imgUrl={
            isUserMessage ? message.content.meta.localUri : message.content.url
          }
        />
      ) : (
        <ImagePreview uri={message.content.previewUrl} />
      )}

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
          }}
          userId={message.user.id}
          date={message.content.date}
        />
      )}

      {bytesTotal != bytesUploaded && (
        <View
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
              padding: 8,
              borderRadius: 15,
              backgroundColor: hexdecimalWithAlpha({ alpha: 0.4, hex: "#000" }),
            }}
          >
            <Text style={[styles.text]}>
              {formatBytes(bytesTotal)}/{formatBytes(bytesUploaded)}
            </Text>
          </View>
        </View>
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
