import React from "react";

import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useMessages } from "@/store/messageStore";

import { PorfilePicture } from "../ProfilePicture";

import {
  ContentType,
  ContentPayload,
  ContentPhotoPayload,
  ContentMessagePayload,
} from "@/@types/types";

import { USER_ID } from "@/supabase/supabase";
import { PhotoMessageLocal } from "./components/PhotoMessageLocal";
import { OnlyMessage } from "./components/OnlyMessage";
import { PhotoMessageRemote } from "./components/PhotoMessageRemote";

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
      case ContentType.photo:
        return isUserMessage ? (
          <PhotoMessageLocal message={message as ContentPhotoPayload} />
        ) : (
          <PhotoMessageRemote message={message as ContentPhotoPayload} />
        );
      case ContentType.message:
        return <OnlyMessage message={message as ContentMessagePayload} />;
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
