// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { Ionicons, AntDesign } from "@expo/vector-icons";

import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import { Text } from "react-native";

type TIoicons = {
  lib: "Ionicons";
} & IconProps<ComponentProps<typeof Ionicons>["name"]>;

type TAntDesign = {
  lib: "AntDesign";
} & IconProps<ComponentProps<typeof AntDesign>["name"]>;

type Icon = TIoicons | TAntDesign;

export function IconApp(props: Icon) {
  if (props.lib == "AntDesign") {
    return <AntDesign size={28} {...props} />;
  } else if (props.lib == "Ionicons") {
    return <Ionicons size={28} {...props} />;
  } else {
    console.error("Choose a valid icon Lib");
    return <Text>?</Text>;
  }
}
