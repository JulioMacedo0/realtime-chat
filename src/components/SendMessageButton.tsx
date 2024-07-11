import {
  AnimatedActivityIndicator,
  AnimatedPressable,
} from "@/constants/AnimatedComponents";
import { IconApp } from "./IconApp/IconApp";
import { PressableProps } from "react-native";
import { ZoomIn, ZoomOut } from "react-native-reanimated";

type Props = PressableProps & {
  loading?: boolean;
};
export const SendMessageButton = ({
  style,
  loading = false,
  ...rest
}: Props) => {
  return (
    <AnimatedPressable
      entering={ZoomIn}
      exiting={ZoomOut}
      style={[
        {
          backgroundColor: "#00af00",
          padding: 10,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <AnimatedActivityIndicator />
      ) : (
        <IconApp lib="Ionicons" name={"send-sharp"} color="#000" />
      )}
    </AnimatedPressable>
  );
};
