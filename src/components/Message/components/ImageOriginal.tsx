import { TouchableOpacity } from "react-native";
import { Image, ImageProps } from "expo-image";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
type Props = ImageProps & {};

export const ImageOriginal = ({ source, style, ...rest }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/contentView?imgUrl=${source}`);
      }}
      activeOpacity={0.7}
      style={styles.imageContainer}
    >
      <Image
        contentFit="cover"
        style={[styles.image, style]}
        source={source}
        {...rest}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    height: undefined,
    borderRadius: 12,
  },
  imageContainer: {
    width: "100%",
  },
});
