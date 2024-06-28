import React from "react";
import { contentType, TMessage } from "@/app/(tabs)";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Image } from "expo-image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useMessages } from "@/store/messageStore";
import { format } from "date-fns";
import { PorfilePicture } from "./ProfilePicture";

type Props = {
  message: TMessage;
  userId: string;
  index: number;
};

export function Message({ message, userId, index }: Props) {
  const colorScheme = useColorScheme();
  const messages = useMessages();
  const { width } = useWindowDimensions();

  const isUserMessage = message.user.id === userId;
  const backgroundColor = isUserMessage
    ? "#0a7ea4"
    : Colors[colorScheme ?? "light"].bgContrast;

  const isSequence = (index: number) => {
    if (index === 0) return false;
    const previousId = messages.at(index - 1)?.user.id;
    return previousId === message.user.id;
  };

  const isSeq = isSequence(index);

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

          {message.content.type === contentType.photo && (
            <View style={styles.imageContainer}>
              <Image
                source={message.content.url}
                contentFit="cover"
                style={[
                  styles.image,
                  {
                    aspectRatio: 3 / 4,
                    width: "100%",
                  },
                ]}
              />
            </View>
          )}

          <View style={styles.messageContainer}>
            <ThemedText
              style={{
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {message.content.message}
            </ThemedText>
            <ThemedText style={[styles.messageDate]}>
              {format(message.content.date, "HH:mm")}
            </ThemedText>
          </View>
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

  messageDate: {
    color: "#ccc",
    fontSize: 13,
    alignSelf: "flex-end",
  },
});
