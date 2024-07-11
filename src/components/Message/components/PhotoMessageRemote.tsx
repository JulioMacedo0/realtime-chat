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
  return (
    <View>
      {imgLoaded ? (
        <ImageOriginal
          placeholder={message.content.previewUrl}
          source={message.content.url}
          onLoadStart={() => {}}
          onLoad={(event) => {
            console.log(event);
          }}
          onLoadEnd={() => {
            setImgLoaded(true);
          }}
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

      {!imgLoaded && (
        <AnimatedTouchableOpacity
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
            <IconApp lib="Ionicons" name="cloud-done-outline" color="#fff" />
            <Text style={[styles.text]}>Download</Text>
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
