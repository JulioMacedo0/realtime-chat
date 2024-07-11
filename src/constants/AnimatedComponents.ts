import { IconApp } from "@/components";
import { Pressable, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedActivityIndicator =
  Animated.createAnimatedComponent(ActivityIndicator);
