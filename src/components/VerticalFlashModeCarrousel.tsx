import { FlashMode } from "expo-camera";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { IconApp } from "./IconApp/IconApp";

type Props = {
  onChange?: (flashMode: FlashMode) => void;
};
export const VerticalFlashModeCarrousel = ({ onChange }: Props) => {
  const items = [
    <IconApp lib="Ionicons" name="flash-off" color="#fff" />,
    <IconApp lib="Ionicons" name="flash" color="#fff" />,
    <IconApp lib="MaterialCommunityIcons" name="flash-auto" color="#fff" />,
  ];
  const [index, setIndex] = useState(0);

  const CurrentComponent = items[index];

  useEffect(() => {
    if (!onChange) return;
    switch (index) {
      case 0:
        onChange("off");
        break;
      case 1:
        onChange("on");
        break;
      case 2:
        onChange("auto");
        break;
      default:
        throw "Invalid value on VerticalFlashModeCarrousel";
    }
  }, [index]);

  const showNextComponent = () => {
    setIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  if (items.length == 0) {
    throw "VerticalCarrousel needs at least 1 item ";
  }

  return (
    <Animated.View entering={FadeInUp.duration(1000)} exiting={FadeInDown}>
      <TouchableOpacity onPress={showNextComponent}>
        {CurrentComponent}
      </TouchableOpacity>
    </Animated.View>
  );
};
