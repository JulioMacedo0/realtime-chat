import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ListRenderItemInfo,
  useColorScheme,
  Pressable,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
} from "react-native-reanimated";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { USER_ID, supabase } from "@/supabase/supabase";

import { Screen } from "@/components";
import { Colors } from "@/constants/Colors";
import { IconApp } from "@/components/IconApp/IconApp";
import {
  GestureDetector,
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Crypto from "expo-crypto";
import { Message } from "@/components/Message";
import { useMessages, useMessagesActions } from "@/store/messageStore";
import { Camera } from "@/components/Camera";
import {
  ContentPayload,
  contentMessage,
  contentPhoto,
  contentType,
  contentVideo,
} from "@/@types/types";
import { Inputchat } from "@/components/InputChat";
import { SendAudioButton } from "@/components/SendAudioButton";

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

  const onMaxReached = () => {
    Alert.alert("Limite máximo atingido!");
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

      <View style={styles.inputContainer}>
        <Inputchat />
        <SendAudioButton />
      </View>
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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
  },
});
