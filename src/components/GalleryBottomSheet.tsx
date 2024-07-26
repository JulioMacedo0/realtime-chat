import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, FlatListProps, View } from "react-native";

import { AssetItem } from "./AssetItem";
import { mediaLibraryAsset } from "@/constants/App";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { keyExtractorId } from "@/helpers/keyExtractorId";

type Props = Omit<
  FlatListProps<MediaLibrary.Asset>,
  "data" | "renderItem"
> & {};
export const GalleryBottomSheet = ({ style, ...props }: Props) => {
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
    <BottomSheetFlatList
      {...props}
      numColumns={3}
      style={[
        style,
        {
          flexWrap: "wrap",
        },
      ]}
      data={mediaAssets}
      keyExtractor={keyExtractorId}
      renderItem={({ index, item, separators }) => (
        <AssetItem index={index} item={item} separators={separators} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      bounces={true}
      //perfomance props

      initialNumToRender={5}
      windowSize={10}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
    />
  );
};
