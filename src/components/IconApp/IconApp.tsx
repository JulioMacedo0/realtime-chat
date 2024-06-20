// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import {
  Ionicons,
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import { Text } from "react-native";

type TIoicons = {
  lib: "Ionicons";
} & IconProps<ComponentProps<typeof Ionicons>["name"]>;

type TAntDesign = {
  lib: "AntDesign";
} & IconProps<ComponentProps<typeof AntDesign>["name"]>;

type TFontAwesome6 = {
  lib: "FontAwesome6";
} & IconProps<ComponentProps<typeof FontAwesome6>["name"]>;

type TMaterialCommunityIcons = {
  lib: "MaterialCommunityIcons";
} & IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]>;

type TFeather = {
  lib: "Feather";
} & IconProps<ComponentProps<typeof Feather>["name"]>;

type Icon =
  | TIoicons
  | TAntDesign
  | TFontAwesome6
  | TMaterialCommunityIcons
  | TFeather;

export function IconApp(props: Icon) {
  if (props.lib == "AntDesign") {
    return <AntDesign size={22} {...props} />;
  } else if (props.lib == "Ionicons") {
    return <Ionicons size={22} {...props} />;
  } else if (props.lib == "FontAwesome6") {
    return <FontAwesome6 size={22} {...props} />;
  } else if (props.lib == "MaterialCommunityIcons") {
    return <MaterialCommunityIcons size={22} {...props} />;
  } else if (props.lib) {
    return <Feather size={22} {...props} />;
  } else {
    console.error("Choose a valid icon Lib");
    return <Text>?</Text>;
  }
}
