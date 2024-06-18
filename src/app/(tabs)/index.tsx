import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ListRenderItemInfo,
  useColorScheme,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import Animated from "react-native-reanimated";
import * as Crypto from "expo-crypto";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/supabase/supabase";
import * as Device from "expo-device";
import { Screen } from "@/components";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Message = {
  id: string;
  content: string;
  user: string;
};

type BroadcastPayload = {
  event: string;
  payload: Message;
  type: string;
};

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const colorScheme = useColorScheme();

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(2, {});
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {});
  };

  useEffect(() => {
    const channel = supabase
      .channel("public:chat")
      .on("broadcast", { event: "message" }, (payload: BroadcastPayload) => {
        console.log(payload);
        setMessages((currentMessages) => [...currentMessages, payload.payload]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async () => {
    await supabase.channel("public:chat").send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Crypto.randomUUID(),
        content: newMessage,
        user: Device.deviceName,
      },
    });
    setNewMessage("");
  };

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => (
    <ThemedView style={styles.messageContainer}>
      <ThemedText
        style={{
          color: "#000",
        }}
      >
        {item.user}
      </ThemedText>
      <ThemedText
        style={{
          color: "#000",
        }}
      >
        -
      </ThemedText>
      <ThemedText
        style={{
          color: "#000",
        }}
      >
        {item.content}
      </ThemedText>
    </ThemedView>
  );
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  return (
    <Screen>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        style={[styles.messageList]}
      />
      <View style={[styles.inputContainer, {}]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",

            backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            borderRadius: 28,
            borderColor: "#ccc",
            borderWidth: 1,
          }}
        >
          <TextInput
            style={[styles.input, {}]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
          />
        </View>
        {/* <Button title="Send" onPress={sendMessage} /> */}
        <AnimatedPressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[
            {
              backgroundColor: "#00af00",
              padding: 8,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            },
            animatedStyle,
          ]}
        >
          <TabBarIcon name="mic" color="#fff" />
        </AnimatedPressable>
      </View>

      {/* <Button title="Pick an image from camera roll" onPress={uploadPhoto} /> */}
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
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    flex: 1,

    padding: 8,
  },
});
