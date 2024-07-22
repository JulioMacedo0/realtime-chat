import { IconApp } from "@/components";
import { Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedActivityIndicator =
  Animated.createAnimatedComponent(ActivityIndicator);
export const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
