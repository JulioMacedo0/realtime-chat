import React from "react";
import { TMessage } from "@/app/(tabs)";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Image } from "expo-image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useMessageStore } from "@/store/messageStore";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type Props = {
  message: TMessage;
  userId: string;
  index: number;
};

export function Message({ message, userId, index }: Props) {
  const colorScheme = useColorScheme();

  const messages = useMessageStore((state) => state.messages);
  const { width } = useWindowDimensions();
  const isUserMessage = message.user.id === userId;
  const backgroundColor = isUserMessage
    ? "#0a7ea4"
    : Colors[colorScheme ?? "light"].bgContrast;

  console.log(index);
  const isSequence = (index: number, id: string) => {
    if (index === 0) return false;

    const previousId = messages.at(index)?.user.id;
    console.log(`index ${index} comparando ${previousId} === ${id}`);
    return previousId === id;
  };

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
              opacity: isSequence(index, userId) ? 0 : 1,
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
