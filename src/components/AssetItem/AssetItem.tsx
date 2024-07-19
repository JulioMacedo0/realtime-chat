import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import { ListRenderItemInfo, View, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { VisionCamera } from "../VisionCamera";
import { AssetDuration } from "./Assetduration";

type Props = ListRenderItemInfo<MediaLibrary.Asset> & {};

export const AssetItem = ({ index, item, separators }: Props) => {
  if (item.id == "-1") return <VisionCamera />;
  const { width } = useWindowDimensions();
  const itemSize = width / 3 - 5;

  return (
    <TouchableOpacity onPress={() => console.log(item)}>
      <Image
        placeholder="'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['"
        source={{ uri: item.uri }}
        style={{
          //  borderRadius: 12,
          width: "100%",
          height: itemSize,
          aspectRatio: 1,
        }}
      />
      {item.mediaType == "video" && <AssetDuration duration={item.duration} />}
    </TouchableOpacity>
  );
};
