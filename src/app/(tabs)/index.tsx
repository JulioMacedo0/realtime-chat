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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/supabase/supabase";
import * as Device from "expo-device";
import { Screen } from "@/components";

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

  const { height } = useWindowDimensions();

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

  return (
    <Screen>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        style={[styles.messageList]}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
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
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    color: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});
