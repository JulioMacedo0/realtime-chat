import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, FlatListProps, View } from "react-native";

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
  const mediaAssetsRef = useRef<MediaLibrary.Asset[]>([mediaLibraryAsset]);
  const [loading, setLoading] = useState(false);

  const hasNextPageRef = useRef(true);
  const endCursorRef = useRef(0);

  const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([
    mediaLibraryAsset,
  ]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    if (loading || !hasNextPageRef.current) return;

    setLoading(true);
    const startTime = performance.now();
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const media = await MediaLibrary.getAssetsAsync({
        first: 18,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        after: endCursorRef.current.toString(),
      });
      console.log(media);
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Execution time: ${duration} milliseconds`);
      mediaAssetsRef.current = [...mediaAssetsRef.current, ...media.assets];
      setMediaAssets([...mediaAssetsRef.current]); // Update state to re-render
      hasNextPageRef.current = media.hasNextPage;
      endCursorRef.current += parseInt(media.endCursor ?? "0");
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (hasNextPageRef.current) {
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
      style={[
        style,
        {
          flexWrap: "wrap",
        },
      ]}
      data={mediaAssets}
      scrollEnabled={scrollEnabled}
      keyExtractor={(item) => item.id}
      renderItem={({ index, item, separators }) => (
        <AssetItem index={index} item={item} separators={separators} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={true} // Unmount components when outside of window
      initialNumToRender={2} // Reduce initial render amount
      maxToRenderPerBatch={1} // Reduce number in each render batch
      updateCellsBatchingPeriod={100} // Increase time between renders
      windowSize={7} // Reduce the window size
    />
  );
};
