import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { VisionCamera } from "./VisionCamera";

type Props = Omit<FlatListProps<MediaLibrary.Asset>, "data" | "renderItem"> & {
  scrollEnabled: boolean;
};
export const GalleryBottomSheet = ({
  style,
  scrollEnabled,
  ...props
}: Props) => {
  const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endcursor, setEndCursor] = useState(0);
  const { width } = useWindowDimensions();
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const media = await MediaLibrary.getAssetsAsync({
        first: 30,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        after: endcursor.toString(),
      });
      console.log(media);
      setMediaAssets((prevMedia) => [...prevMedia, ...media.assets]);
      setHasNextPage(media.hasNextPage);
      setEndCursor((pervSate) => pervSate + parseInt(media.endCursor ?? "0"));
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    console.log({ hasNextPage });
    if (hasNextPage) {
      fetchMedia();
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingTop: 15 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  const itemSize = width / 3;
  return (
    <FlatList
      {...props}
      numColumns={3}
      style={[
        {
          backgroundColor: "#ee1",
        },
        style,
      ]}
      data={mediaAssets}
      scrollEnabled={scrollEnabled}
      keyExtractor={(item) => item.id}
      // ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      renderItem={({ item, index }) => {
        if (item.mediaType == "photo") {
          return (
            <>
              {index == 0 && (
                <View
                  style={{
                    width: itemSize,
                    height: itemSize,
                  }}
                >
                  <VisionCamera />
                </View>
              )}
              <Image
                placeholder="'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['"
                source={{ uri: item.uri }}
                style={{ width: itemSize, height: itemSize }}
              />
            </>
          );
        } else {
          return (
            <>
              {index == 0 && (
                <View
                  style={{
                    width: itemSize,
                    height: itemSize,
                  }}
                >
                  <VisionCamera />
                </View>
              )}
              <View style={{ width: itemSize, height: itemSize }}>
                <Text>Video not suported yet</Text>
              </View>
            </>
          );
        }
      }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};
