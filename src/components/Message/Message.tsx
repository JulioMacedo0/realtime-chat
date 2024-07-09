import React from "react";

import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useMessages } from "@/store/messageStore";

import { PorfilePicture } from "../ProfilePicture";

import {
  contentType,
  ContentPayload,
  ContentPhotoPayload,
} from "@/@types/types";
import { useStorageUpload } from "@/hooks/useStorageUpload";
import { DateMessage } from "./components/DateMessage";
import { MessageText } from "./components/MessageText";
import { USER_ID } from "@/supabase/supabase";
import { PhotoMessage } from "./components/PhotoMessage";

type Props = {
  message: ContentPayload;

  index: number;
};

export function Message({ message, index }: Props) {
  const colorScheme = useColorScheme();
  const messages = useMessages();

  const { width } = useWindowDimensions();

  const isUserMessage = message.user.id === USER_ID;
  const backgroundColor = isUserMessage
    ? "#0a7ea4"
    : Colors[colorScheme ?? "light"].bgContrast;

  const isSequence = (index: number) => {
    if (index === 0) return false;
    const previousId = messages.at(index - 1)?.user.id;
    return previousId === message.user.id;
  };

  const isSeq = isSequence(index);

  const renderContent = () => {
    switch (message.content.type) {
      case contentType.photo:
        return <PhotoMessage message={message as ContentPhotoPayload} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.messageWrapper,
        isUserMessage ? styles.userMessageWrapper : styles.otherMessageWrapper,
      ]}
    >
      <ThemedView style={{ flexDirection: "row" }}>
        {!isUserMessage && (
          <PorfilePicture
            isSeq={isSeq}
            source="https://avatars.githubusercontent.com/u/57598810?v=4"
          />
        )}
        <View
          style={[
            styles.container,
            {
              backgroundColor,
              maxWidth: width * 0.65,
            },
          ]}
        >
          {!isUserMessage && !isSeq && (
            <ThemedView style={{ backgroundColor: "transparent" }}>
              <ThemedText
                style={{
                  color: Colors[colorScheme ?? "light"].text,
                  fontWeight: "bold",
                }}
              >
                UserName
              </ThemedText>
            </ThemedView>
          )}

          {renderContent()}

          {message.content.message && (
            <View style={styles.messageContainer}>
              <MessageText
                userId={message.user.id}
                text={message.content.message}
              />
              <DateMessage
                userId={message.user.id}
                date={message.content.date}
              />
            </View>
          )}
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: "row",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  otherMessageWrapper: {
    justifyContent: "flex-start",
  },
  container: {
    borderRadius: 12,
    padding: 4,
  },
  imageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: undefined,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
