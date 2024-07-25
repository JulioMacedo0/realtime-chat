import { AnimatedBottomSheetHandle } from "@/constants/AnimatedComponents";
import { Colors } from "@/constants/Colors";
import { BottomSheetHandle } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultHandleProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useCallback, useEffect } from "react";
import { Animated, useColorScheme, View } from "react-native";
import {
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  ref: React.RefObject<BottomSheetModalMethods>;
  headerHeight: number;
} & BottomSheetDefaultHandleProps;

export function HandleComponent({
  animatedIndex,
  animatedPosition,
  headerHeight,
  ref,

  ...props
}: Props) {
  const Header = useCallback(() => {
    return <Animated.View></Animated.View>;
  }, []);

  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius:
        animatedPosition.value <= headerHeight ? withTiming(0) : withTiming(15),
      borderTopRightRadius:
        animatedPosition.value <= headerHeight ? withTiming(0) : withTiming(15),
      backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
      height:
        animatedPosition.value <= headerHeight
          ? withTiming(headerHeight)
          : withTiming(0),
    };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      opacity:
        animatedPosition.value <= headerHeight ? withTiming(0) : withTiming(1),
    };
  });

  return (
    <BottomSheetHandle
      {...props}
      children={Header}
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={[animatedStyle]}
      indicatorStyle={[animatedIndicatorStyle]}
    />
  );
}
