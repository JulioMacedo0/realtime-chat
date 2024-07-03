import { useEffect, useRef, useState } from "react";
import { PixelRatio, StyleSheet, View, Button } from "react-native";
import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

type Props = {
  uri: string;
};
export function VideoPlayer({ uri }: Props) {
  const video = useRef(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess>();

  return (
    <View style={styles.contentContainer}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri,
        }}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        useNativeControls
        onPlaybackStatusUpdate={(playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            if (playbackStatus.error) {
              console.log(
                `Encountered a fatal error during playback: ${playbackStatus.error}`
              );
              // Send Expo team the error on Slack or the forums so we can help you debug!
            }
          } else {
            // Update your UI for the loaded state

            if (playbackStatus.isPlaying) {
              // Update your UI for the playing state
            } else {
              // Update your UI for the paused state
            }

            if (playbackStatus.isBuffering) {
              // Update your UI for the buffering state
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
              // The player has just finished playing and will stop. Maybe you want to play something else?
            }
          }
        }}
      />
      <View style={styles.controlsContainer}>
        {/* <Button
          title={status.isPlaying ? "Pause" : "Play"}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    padding: 10,
  },
});
