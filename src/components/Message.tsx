import React from "react";
import { TMessage } from "@/app/(tabs)";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Image } from "expo-image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type Props = {
  message: TMessage;
  userId: string;
};

export function Message({ message, userId }: Props) {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isUserMessage = message.user.id === userId;
  const backgroundColor = isUserMessage
    ? "#0a7ea4"
    : Colors[colorScheme ?? "light"].bgContrast;

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View
      style={[
        styles.messageWrapper,
        isUserMessage ? styles.userMessageWrapper : styles.otherMessageWrapper,
      ]}
    >
      <ThemedView
        style={{
          flexDirection: "row",
        }}
      >
        {!isUserMessage && (
          <Image
            source="https://avatars.githubusercontent.com/u/57598810?v=4"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              marginRight: 10,
            }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
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
          {!isUserMessage && (
            <ThemedView
              style={{
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                style={{
                  color: Colors[colorScheme ?? "light"].text,
                }}
              >
                UserName
              </ThemedText>
            </ThemedView>
          )}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <ThemedText
              style={{
                color: Colors[colorScheme ?? "light"].text,
              }}
            >
              {message.content.message}
            </ThemedText>
            <ThemedText
              style={{
                color: "#ccc",
                fontSize: 13,
                alignSelf: "flex-end",
              }}
            >
              15:30
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
    marginVertical: 5,
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  otherMessageWrapper: {
    justifyContent: "flex-start",
  },
  container: {
    padding: 10,
    borderRadius: 12,
  },
});
