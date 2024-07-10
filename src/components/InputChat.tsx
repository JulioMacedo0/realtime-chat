import { ContentPayload } from "@/@types/types";

import { IconApp } from "@/components";
import { Camera } from "@/components/Camera";
import { Colors } from "@/constants/Colors";
import { USER_ID } from "@/supabase/supabase";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";

type Props = {};
export const Inputchat = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentPayload>({
    defaultValues: {
      content: {
        message: "",
      },
      user: {
        id: USER_ID,
      },
    },
  });

  const colorScheme = useColorScheme();
  return (
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
              } else if (text.length >= 1) {
              }
            }}
            value={value}
          />
        )}
        name="content.message"
      />

      <TouchableOpacity activeOpacity={0.4}>
        <IconApp lib="MaterialCommunityIcons" name="paperclip" color="#ccc" />
      </TouchableOpacity>

      <Camera />
    </View>
  );
};

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
