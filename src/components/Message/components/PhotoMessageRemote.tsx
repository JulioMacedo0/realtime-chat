import { ContentPhotoPayload } from "@/@types/types";
import { ImagePreview } from "./ImagePreview";

import { View, StyleSheet, Text } from "react-native";
import { MessageText } from "./MessageText";
import { DateMessage } from "./DateMessage";
import { hexdecimalWithAlpha } from "@/helpers/hexdecimalWithAlpha";
import { formatBytes } from "@/helpers/formatBytes";
import { IconApp } from "@/components/IconApp/IconApp";
import { AnimatedTouchableOpacity } from "@/constants/AnimatedComponents";
import { ZoomIn, ZoomOut } from "react-native-reanimated";
import { useState } from "react";
import { ImageOriginal } from "./ImageOriginal";

type Props = {
  message: ContentPhotoPayload;
};

export const PhotoMessageRemote = ({ message }: Props) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgLoading, setimgLoading] = useState(false);
  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [bytesTotal, setBytesTotal] = useState(0);
  const [showRealImg, setShowRealImg] = useState(false);
  return (
    <View>
      {!imgLoaded && <ImagePreview uri={message.content.previewUrl} />}
      {showRealImg && (
        <ImageOriginal
          style={{
            height: imgLoaded ? undefined : 1,
            opacity: imgLoaded ? 1 : 0,
          }}
          onLoadStart={() => {
            setimgLoading(true);
          }}
          onProgress={(event) => {
            setBytesTotal(event.total);
            setBytesUploaded(event.loaded);
          }}
          onLoad={() => {
            setImgLoaded(true);
          }}
          onError={(event) => {
            alert(`Erro on loading Imagem: ${event.error}`);
            setimgLoading(false);
          }}
          source={message.content.url}
        />
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
            color: "#fff",
          }}
          userId={message.user.id}
          date={message.content.date}
        />
      )}

      {!imgLoaded && (
        <AnimatedTouchableOpacity
          onPress={() => setShowRealImg(true)}
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
              flexDirection: "row",
              gap: 4,
              alignContent: "center",
              justifyContent: "center",
              padding: 8,
              borderRadius: 15,
              backgroundColor: hexdecimalWithAlpha({ alpha: 0.4, hex: "#000" }),
            }}
          >
            {imgLoading ? (
              <Text style={[styles.text]}>
                {formatBytes(bytesTotal)}/{formatBytes(bytesUploaded)}
              </Text>
            ) : (
              <>
                <IconApp
                  lib="Ionicons"
                  name="cloud-done-outline"
                  color="#fff"
                />
                <Text style={[styles.text]}>Download</Text>
              </>
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
