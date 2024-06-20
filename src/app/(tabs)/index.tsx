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
import Animated, { withTiming } from "react-native-reanimated";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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

interface IFormInput {
  id: string;
  content: string;
  user: string | null;
}

type Gesture = GestureUpdateEvent<PanGestureHandlerEventPayload>;

export default function HomeScreen() {
  function clamp({ val, min, max }: Clamp) {
    return Math.min(Math.max(val, min), max);
  }

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      id: Crypto.randomUUID(),
      content: "",
      user: Device.deviceName,
    },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMessage, setHasmessage] = useState(false);

  const colorScheme = useColorScheme();

  const scale = useSharedValue(1);
  const iconOpacity = useSharedValue(0);

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

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
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

  const sendMessage = async (payload: IFormInput) => {
    await supabase.channel("public:chat").send({
      type: "broadcast",
      event: "message",
      payload,
    });
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

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    // sendMessage(data);
  };

  useEffect(() => {
    iconOpacity.value = withTiming(0, { duration: 200 }, () => {
      iconOpacity.value = withTiming(1, { duration: 200 });
    });
  }, [hasMessage]);

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
            paddingHorizontal: 12,
            gap: 6,
          }}
        >
          <TouchableOpacity activeOpacity={0.4}>
            <IconApp lib="FontAwesome6" name="face-laugh" color="#ccc" />
          </TouchableOpacity>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Message"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  setHasmessage(!!text);
                }}
                value={value}
              />
            )}
            name="content"
          />

          <TouchableOpacity activeOpacity={0.4}>
            <IconApp
              lib="MaterialCommunityIcons"
              name="paperclip"
              color="#ccc"
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.4}>
            <IconApp lib="Feather" name="camera" color="#ccc" />
          </TouchableOpacity>
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedViewStyle}>
            <AnimatedPressable
              hitSlop={20}
              onPress={handleSubmit(onSubmit)}
              // onPressOut={onPressOut}
              style={[
                {
                  backgroundColor: "#00af00",
                  padding: 10,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                },
                animatedPressableStyle,
              ]}
            >
              <Animated.View style={animatedIconStyle}>
                <IconApp
                  lib="Ionicons"
                  name={hasMessage ? "send-sharp" : "mic"}
                  color="#000"
                />
              </Animated.View>
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
    paddingVertical: 6,
  },
});
