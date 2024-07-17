import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
  isSelected: boolean;
  Icon: ReactNode;
  bgIconColor: string;
  name: string;
};
export const BottomSheetButton = ({
  Icon,
  name,
  isSelected,
  bgIconColor,
}: Props) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginRight: 40,
      }}
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
    </View>
  );
};
