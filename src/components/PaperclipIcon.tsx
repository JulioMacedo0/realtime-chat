import { TouchableOpacity } from "react-native";
import { IconApp } from "./IconApp/IconApp";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { AppBottomSheet } from "./AppBottomSheet";

export const PaperClipIcon = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <TouchableOpacity activeOpacity={0.4} onPress={handlePresentModalPress}>
      <IconApp lib="MaterialCommunityIcons" name="paperclip" color="#ccc" />
      <AppBottomSheet ref={bottomSheetRef} />
    </TouchableOpacity>
  );
};
