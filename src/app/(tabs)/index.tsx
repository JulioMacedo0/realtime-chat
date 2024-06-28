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
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as Crypto from "expo-crypto";

import { supabase } from "@/supabase/supabase";

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
import { Message } from "@/components/Message";
import { useMessages, useMessagesActions } from "@/store/messageStore";
import { Camera } from "@/components/Camera";

export type TMessage = IFormInput;

type BroadcastPayload = {
  event: string;
  payload: TMessage;
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

export enum contentType {
  message = "message",
  photo = "photo",
}

type contentMessage = {
  type: contentType.message;
  id: string;
  date: string;
  message: string;
};

type contentPhoto = {
  type: contentType.photo;
  message: string;
  id: string;
  date: string;
  url: string;
};

export interface IFormInput {
  content: contentMessage | contentPhoto;
  user: {
    id: string;
  };
}

type Gesture = GestureUpdateEvent<PanGestureHandlerEventPayload>;

export const userID = Crypto.randomUUID();

export default function HomeScreen() {
  function clamp({ val, min, max }: Clamp) {
    return Math.min(Math.max(val, min), max);
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      content: {
        message: "",
      },
      user: {
        id: userID,
      },
    },
  });

  const messages = useMessages();

  const { addMessage } = useMessagesActions();

  const [hasMessage, setHasmessage] = useState(false);
  const { height } = useWindowDimensions();
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
      .on("broadcast", { event: `message` }, (payload: BroadcastPayload) => {
        addMessage(payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (payload: IFormInput) => {
    const resp = await supabase.channel("public:chat").send({
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
    .enabled(!hasMessage)
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

  const renderItem = ({
    item,
    index,
    separators,
  }: ListRenderItemInfo<TMessage>) => (
    <Message message={item} userId={userID} index={index} />
  );

  const renderSeparator = () => (
    <View
      style={{
        height: height * 0.004,
      }}
    />
  );

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);

    const now = new Date();

    const id = Crypto.randomUUID();
    const payload: IFormInput = {
      content: {
        ...data.content,
        id,
        type: contentType.message,
        date: now.toISOString(),
      },
      user: { ...data.user },
    };
    sendMessage(payload);
    reset();
    setHasmessage(false);
  };

  const handleButton = () => {
    if (hasMessage) {
      handleSubmit(onSubmit)();
    } else {
      console.log("send audio");
    }
  };
  return (
    <Screen>
      <FlatList
        data={messages}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={(item, index) => item.content.id}
        style={[styles.messageList]}
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
            rules={{}}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholderTextColor="#ccc"
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                placeholder="Message"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);

                  if (text.length == 0) {
                    setHasmessage(false);
                  } else if (text.length == 1) {
                    setHasmessage(true);
                  }
                }}
                value={value}
              />
            )}
            name="content.message"
          />

          <TouchableOpacity activeOpacity={0.4}>
            <IconApp
              lib="MaterialCommunityIcons"
              name="paperclip"
              color="#ccc"
            />
          </TouchableOpacity>

          <Camera />
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedViewStyle}>
            <AnimatedPressable
              hitSlop={20}
              onPress={handleButton}
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
              <IconApp
                lib="Ionicons"
                name={hasMessage ? "send-sharp" : "mic"}
                color="#000"
              />
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
