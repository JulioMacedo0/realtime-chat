import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ListRenderItemInfo,
  useWindowDimensions,
} from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { USER_ID, supabase } from "@/supabase/supabase";

import { Screen } from "@/components";

import { Message } from "@/components/Message";
import { useMessages, useMessagesActions } from "@/store/messageStore";
import { ContentPayload } from "@/@types/types";

import { BottomChatInput } from "@/components/BottomChatInput";

type BroadcastPayload = {
  event: string;
  payload: ContentPayload;
  type: string;
};

export default function HomeScreen() {
  const animatedRef = useAnimatedRef<Animated.FlatList<ContentPayload>>();

  const messages = useMessages();

  const { addMessage } = useMessagesActions();

  const { height } = useWindowDimensions();

  useEffect(() => {
    const channel = supabase
      .channel("public:chat")
      .on("broadcast", { event: `message` }, (payload: BroadcastPayload) => {
        if (USER_ID != payload.payload.user.id) {
          addMessage(payload.payload);
          animatedRef.current?.scrollToEnd({ animated: true });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderItem = ({
    item,
    index,
    separators,
  }: ListRenderItemInfo<ContentPayload>) => (
    <Message message={item} index={index} />
  );

  const renderSeparator = () => (
    <View
      style={{
        height: height * 0.004,
      }}
    />
  );

  return (
    <Screen>
      <Animated.FlatList
        ref={animatedRef}
        data={messages}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={(item, index) => item.content.id}
        style={[styles.messageList]}
      />

      <BottomChatInput />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
  },
});
