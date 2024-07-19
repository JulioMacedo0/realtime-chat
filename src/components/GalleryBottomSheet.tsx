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

import { VisionCamera } from "./VisionCamera";
import { AssetItem } from "./AssetItem";
import { mediaLibraryAsset } from "@/constants/App";

type Props = Omit<FlatListProps<MediaLibrary.Asset>, "data" | "renderItem"> & {
  scrollEnabled: boolean;
};
export const GalleryBottomSheet = ({
  style,
  scrollEnabled,
  ...props
}: Props) => {
  const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([
    mediaLibraryAsset,
  ]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endcursor, setEndCursor] = useState(0);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    const startTime = performance.now();
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const media = await MediaLibrary.getAssetsAsync({
        first: 30,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        after: endcursor.toString(),
      });
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Execution time: ${duration} milliseconds`);
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

  return (
    <FlatList
      {...props}
      numColumns={3}
      style={[style]}
      data={mediaAssets}
      scrollEnabled={scrollEnabled}
      keyExtractor={(item) => item.id}
      // ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      renderItem={({ index, item, separators }) => (
        <AssetItem index={index} item={item} separators={separators} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      // Performance settings
      removeClippedSubviews={true} // Unmount components when outside of window
      initialNumToRender={2} // Reduce initial render amount
      maxToRenderPerBatch={1} // Reduce number in each render batch
      updateCellsBatchingPeriod={100} // Increase time between renders
      windowSize={7} // Reduce the window size
    />
  );
};
