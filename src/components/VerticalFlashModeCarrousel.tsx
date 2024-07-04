import { FlashMode } from "expo-camera";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
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

  const enteringAnimation = new Keyframe({
    0: { opacity: 0, transform: [{ translateY: -50 }] },
    100: { opacity: 1, transform: [{ translateY: 0 }] },
  }).duration(100);

  const exitingAnimation = new Keyframe({
    0: { opacity: 1, transform: [{ translateY: 0 }] },
    100: { opacity: 0, transform: [{ translateY: 50 }] },
  }).duration(100);

  return (
    <TouchableOpacity onPress={showNextComponent}>
      <Animated.View
        key={index}
        entering={enteringAnimation}
        exiting={exitingAnimation}
      >
        {items[index]}
      </Animated.View>
    </TouchableOpacity>
  );
};
