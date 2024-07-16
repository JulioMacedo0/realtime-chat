import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Inputchat } from "./InputChat";
import { IconApp } from "./IconApp/IconApp";
import { Camera } from "./Camera";
import { useForm, Controller } from "react-hook-form";
import { ContentPayload, ContentType } from "@/@types/types";
import { USER_ID } from "@/supabase/supabase";
import { ToggleInputButtons } from "./ToggleInputButtons";
import { PaperClipIcon } from "./PaperclipIcon";

type Props = {};

export const BottomChatInput = ({}: Props) => {
  const { control } = useForm<ContentPayload>({
    defaultValues: {
      content: {
        message: "",
        type: ContentType.message,
      },
      user: {
        id: USER_ID,
      },
    },
  });

  return (
    <View style={styles.Container}>
      <Controller
        control={control}
        name="content.message"
        render={({ field: { onChange, onBlur, value } }) => (
          <Inputchat
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            prefix={
              <TouchableOpacity activeOpacity={0.4}>
                <IconApp lib="FontAwesome6" name="face-laugh" color="#ccc" />
              </TouchableOpacity>
            }
            suffixs={[<PaperClipIcon />, <Camera />]}
          />
        )}
      />

      <ToggleInputButtons control={control} />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
