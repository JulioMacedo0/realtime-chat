import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
type Props = {
  imgUrl: string;
};

export const ImageOriginal = ({ imgUrl }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/contentView?imgUrl=${imgUrl}`);
      }}
      activeOpacity={0.7}
      style={styles.imageContainer}
    >
      <Image source={imgUrl} contentFit="cover" style={styles.image} />
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
