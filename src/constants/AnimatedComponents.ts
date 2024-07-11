import { IconApp } from "@/components";
import { Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedActivityIndicator =
  Animated.createAnimatedComponent(ActivityIndicator);
export const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
