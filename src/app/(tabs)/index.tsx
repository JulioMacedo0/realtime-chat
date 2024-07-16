import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { USER_ID, supabase } from "@/supabase/supabase";

import { Screen } from "@/components";

import { useMessagesActions } from "@/store/messageStore";
import { ContentPayload } from "@/@types/types";

import { BottomChatInput } from "@/components/BottomChatInput";
import { MessageList } from "@/components/MessagesList";

type BroadcastPayload = {
  event: string;
  payload: ContentPayload;
  type: string;
};

export default function HomeScreen() {
  console.log("HomeScreen");
  const animatedRef = useAnimatedRef<Animated.FlatList<ContentPayload>>();

  const { addMessage } = useMessagesActions();

  useEffect(() => {
    const channel = supabase
      .channel("public:chat")
      .on("broadcast", { event: `message` }, (payload: BroadcastPayload) => {
        if (USER_ID != payload.payload.user.id) {
          addMessage(payload.payload);
        }
        animatedRef.current?.scrollToEnd({ animated: true });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Screen>
      <MessageList ref={animatedRef} />
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 6,
  },
});
