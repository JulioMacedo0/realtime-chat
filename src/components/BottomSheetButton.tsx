import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { Text, ViewProps } from "react-native";
import Animated, { BounceIn } from "react-native-reanimated";

type Props = ViewProps & {
  isSelected: boolean;
  Icon: ReactNode;
  bgIconColor: string;
  name: string;
};
export const BottomSheetButton = ({
  style,
  Icon,
  name,
  isSelected,
  bgIconColor,
  ...props
}: Props) => {
  return (
    <Animated.View
      entering={BounceIn.delay(150)}
      {...props}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          marginRight: 40,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => console.log(name)}
        activeOpacity={0.7}
        style={{
          width: 55,
          height: 55,
          backgroundColor: bgIconColor,
          borderRadius: 99,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        {Icon}
      </TouchableOpacity>

      <Text style={{ color: isSelected ? bgIconColor : "#ccc" }}>{name}</Text>
    </Animated.View>
  );
};
