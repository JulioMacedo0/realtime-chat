import { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
  isSelected: boolean;
  Icon: ReactNode;
  bgIconColor: string;
  Name: string;
};
export const BottomSheetButton = ({
  Icon,
  Name,
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
      <View
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
      </View>

      <Text style={{ color: isSelected ? bgIconColor : "#ccc" }}>{Name}</Text>
    </View>
  );
};
