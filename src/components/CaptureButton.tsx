import { useCallback, useRef } from "react";
import { ViewProps } from "react-native";
import { cancelAnimation, useSharedValue } from "react-native-reanimated";
import { Camera, PhotoFile, VideoFile } from "react-native-vision-camera";

type onMediaCapturedParams = onPhotoCaptured | onVideoCaptured;

type onPhotoCaptured = {
  media: PhotoFile;
  type: "photo";
};

type onVideoCaptured = {
  media: VideoFile;
  type: "video";
};

type Props = ViewProps & {
  camera: React.RefObject<Camera>;
  onMediaCaptured: ({ media, type }: onMediaCapturedParams) => void;
  flash: "on" | "off" | "auto";
};

export const CaptureButton = ({ camera, onMediaCaptured, flash }: Props) => {
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);

  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      console.log("Taking photo...");
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });
      onMediaCaptured({ media: photo, type: "photo" });
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  }, [camera, flash, onMediaCaptured]);

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
    console.log("stopped recording video!");
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      console.log("calling stopRecording()...");
      await camera.current.stopRecording();
      console.log("called stopRecording()!");
    } catch (e) {
      console.error("failed to stop recording!", e);
    }
  }, [camera]);

  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      console.log("calling startRecording()...");
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          console.error("Recording failed!", error);
          onStoppedRecording();
        },

        onRecordingFinished: (video) => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured({ media: video, type: "video" });
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log("called startRecording()!");
      isRecording.current = true;
    } catch (e) {
      console.error("failed to start recording!", e, "camera");
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
};
