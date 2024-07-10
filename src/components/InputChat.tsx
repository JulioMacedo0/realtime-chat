import { Colors } from "@/constants/Colors";
import React from "react";
import {
  TextInput,
  View,
  useColorScheme,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  type TextInputProps,
} from "react-native";

type Props = TextInputProps & {
  containerInputStyle?: StyleProp<ViewStyle>;
  TextInputStyle?: StyleProp<TextStyle>;
  prefix?: React.JSX.Element;
  suffixs?: React.JSX.Element[];
};
export const Inputchat = ({
  containerInputStyle,
  TextInputStyle,
  prefix,
  suffixs,
  ...rest
}: Props) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        {
          backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
        },
        styles.inputContainer,
        containerInputStyle,
      ]}
    >
      {prefix}

      <TextInput
        placeholderTextColor="#ccc"
        placeholder="Message"
        style={[
          styles.input,
          {
            color: Colors[colorScheme ?? "light"].text,
          },
          TextInputStyle,
        ]}
        {...rest}
      />
      {suffixs &&
        suffixs.map((suffix, index) => (
          <React.Fragment key={index}>{suffix}</React.Fragment>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
  },
});
