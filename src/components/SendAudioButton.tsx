import { AnimatedPressable } from "@/constants/AnimatedComponents";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IconApp } from "./IconApp/IconApp";
import { clamp } from "@/helpers/clamp";

export const SendAudioButton = () => {
  const scale = useSharedValue(1);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const MAX_TRANSLATE_X = 200;
  const MAX_TRANSLATE_Y = 115;

  const animatedPressableStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(2, {
      damping: 8,
      stiffness: 150,
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 150,
    });
  };

  let initialDirection: null | "x" | "y" = null;
  const TOLERANCE = 10;
  const panGesture = Gesture.Pan()

    .minDistance(1)
    .onBegin(() => {
      scale.value = withSpring(2.2, {
        damping: 8,
        stiffness: 150,
      });
    })
    .onStart((event) => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = MAX_TRANSLATE_X;
      const maxTranslateY = MAX_TRANSLATE_Y;

      let nextTranslateX = event.translationX;
      let nextTranslateY = event.translationY;

      if (nextTranslateX >= 0) {
        initialDirection = null;
      }

      if (nextTranslateY >= 0) {
        initialDirection = null;
      }

      if (initialDirection === null) {
        if (
          Math.abs(nextTranslateX) > TOLERANCE ||
          Math.abs(nextTranslateY) > TOLERANCE
        ) {
          if (Math.abs(nextTranslateX) > Math.abs(nextTranslateY)) {
            initialDirection = "x";
          } else {
            initialDirection = "y";
          }
        }
      }

      if (nextTranslateX > 0) {
        nextTranslateX = 0;
      }
      if (nextTranslateY > 0) {
        nextTranslateY = 0;
      }

      if (initialDirection === "x") {
        nextTranslateY = translationY.value;
      } else {
        nextTranslateX = translationX.value;
      }

      if (
        Math.abs(nextTranslateX) >= maxTranslateX ||
        Math.abs(nextTranslateY) >= maxTranslateY
      ) {
        // runOnJS(onMaxReached)();
      } else {
        translationX.value = clamp({
          val: nextTranslateX,
          min: -maxTranslateX,
          max: maxTranslateX,
        });

        translationY.value = clamp({
          val: nextTranslateY,
          min: -maxTranslateY,
          max: maxTranslateY,
        });
      }
    })
    .onEnd(() => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
      });
      initialDirection = null;
    })
    .onTouchesUp(() => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
      });
      initialDirection = null;
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedViewStyle}>
        <AnimatedPressable
          hitSlop={20}
          onPress={() => console.log("send audio")}
          // onPressOut={onPressOut}
          style={[
            {
              backgroundColor: "#00af00",
              padding: 10,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            },
            animatedPressableStyle,
          ]}
        >
          <IconApp lib="Ionicons" name={"mic"} color="#000" />
        </AnimatedPressable>
      </Animated.View>
    </GestureDetector>
  );
};
