import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  ListRenderItemInfo,
  useColorScheme,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import Animated, { runOnJS } from "react-native-reanimated";

import * as Crypto from "expo-crypto";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/supabase/supabase";
import * as Device from "expo-device";
import { Screen } from "@/components";
import { Colors } from "@/constants/Colors";
import { IconApp } from "@/components/IconApp/IconApp";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/reanimated2/component/View";

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

type ContextType = {
  startX: number;
  startY: number;
};

type Clamp = {
  val: number;
  min: number;
  max: number;
};

type Gesture = GestureUpdateEvent<PanGestureHandlerEventPayload>;

export default function HomeScreen() {
  function clamp({ val, min, max }: Clamp) {
    return Math.min(Math.max(val, min), max);
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const colorScheme = useColorScheme();

  const scale = useSharedValue(1);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const MAX_TRANSLATE_X = 200;
  const MAX_TRANSLATE_Y = 115;

  const animatedPressableStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(2, {
      damping: 8,
      stiffness: 150,
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 150,
    });
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

  const onMaxReached = () => {
    Alert.alert("Limite máximo atingido!");
  };

  let initialDirection: null | "x" | "y" = null;
  const TOLERANCE = 10;
  const panGesture = Gesture.Pan()
    .enabled(true)
    .minDistance(1)
    .onBegin(() => {
      scale.value = withSpring(2.2, {
        damping: 8,
        stiffness: 150,
      });
    })
    .onStart((event) => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = MAX_TRANSLATE_X;
      const maxTranslateY = MAX_TRANSLATE_Y;

      let nextTranslateX = event.translationX;
      let nextTranslateY = event.translationY;

      if (nextTranslateX >= 0) {
        initialDirection = null;
      }

      if (nextTranslateY >= 0) {
        initialDirection = null;
      }

      if (initialDirection === null) {
        if (
          Math.abs(nextTranslateX) > TOLERANCE ||
          Math.abs(nextTranslateY) > TOLERANCE
        ) {
          if (Math.abs(nextTranslateX) > Math.abs(nextTranslateY)) {
            initialDirection = "x";
          } else {
            initialDirection = "y";
          }
        }
      }

      if (nextTranslateX > 0) {
        nextTranslateX = 0;
      }
      if (nextTranslateY > 0) {
        nextTranslateY = 0;
      }

      if (initialDirection === "x") {
        nextTranslateY = translationY.value;
      } else {
        nextTranslateX = translationX.value;
      }

      if (
        Math.abs(nextTranslateX) >= maxTranslateX ||
        Math.abs(nextTranslateY) >= maxTranslateY
      ) {
        // runOnJS(onMaxReached)();
      } else {
        translationX.value = clamp({
          val: nextTranslateX,
          min: -maxTranslateX,
          max: maxTranslateX,
        });

        translationY.value = clamp({
          val: nextTranslateY,
          min: -maxTranslateY,
          max: maxTranslateY,
        });
      }
    })
    .onEnd(() => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
      });
      initialDirection = null;
    })
    .onTouchesUp(() => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
      });
      initialDirection = null;
    })
    .runOnJS(true);

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => (
    <ThemedView style={styles.messageContainer}>
      <ThemedText style={{ color: "#000" }}>{item.user}</ThemedText>
      <ThemedText style={{ color: "#000" }}>-</ThemedText>
      <ThemedText style={{ color: "#000" }}>{item.content}</ThemedText>
    </ThemedView>
  );

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <Screen>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
            borderRadius: 28,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingHorizontal: 6,
          }}
        >
          <TouchableOpacity>
            <IconApp lib="Ionicons" name="accessibility" color="#ccc" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Message"
          />
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedViewStyle}>
            <AnimatedPressable
              hitSlop={20}
              // onPressIn={onPressIn}
              // onPressOut={onPressOut}
              style={[
                {
                  backgroundColor: "#00af00",
                  padding: 8,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                },
                animatedPressableStyle,
              ]}
            >
              <IconApp lib="Ionicons" name="mic" color="#fff" />
            </AnimatedPressable>
          </Animated.View>
        </GestureDetector>
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
