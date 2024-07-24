import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
};

export const AbsoluteCenter = ({ children }: Props) => {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </View>
  );
};
