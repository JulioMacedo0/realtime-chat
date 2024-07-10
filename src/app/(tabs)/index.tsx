import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ListRenderItemInfo,
  useWindowDimensions,
} from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SubmitHandler } from "react-hook-form";

import { USER_ID, supabase } from "@/supabase/supabase";

import { Screen } from "@/components";

import * as Crypto from "expo-crypto";
import { Message } from "@/components/Message";
import { useMessages, useMessagesActions } from "@/store/messageStore";
import { ContentPayload, contentType } from "@/@types/types";

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

  const sendMessage = async (payload: ContentPayload) => {
    addMessage(payload);
    animatedRef.current?.scrollToEnd({ animated: true });
    const resp = await supabase.channel("public:chat").send({
      type: "broadcast",
      event: "message",
      payload,
    });
  };

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

  const onSubmit: SubmitHandler<ContentPayload> = (data) => {
    console.log(data);

    const now = new Date();

    const id = Crypto.randomUUID();
    const payload: ContentPayload = {
      content: {
        ...data.content,
        id,
        type: contentType.message,
        date: now.toISOString(),
      },
      user: { ...data.user },
    };
    sendMessage(payload);
  };

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
