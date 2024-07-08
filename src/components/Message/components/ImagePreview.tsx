import { Image } from "expo-image";
import { StyleSheet } from "react-native";
type Props = {
  uri: string;
};

export const ImagePreview = ({ uri }: Props) => {
  return (
    <Image
      source={uri}
      contentFit="cover"
      blurRadius={1}
      style={styles.image}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    height: undefined,
    borderRadius: 12,
  },
});
