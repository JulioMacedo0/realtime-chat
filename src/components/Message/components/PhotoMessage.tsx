import { ContentPhotoPayload } from "@/@types/types";
import { ImagePreview } from "./ImagePreview";
import { View } from "react-native";
import { MessageText } from "./MessageText";
import { DateMessage } from "./DateMessage";
import { ImageOriginal } from "./ImageOriginal";

export const PhotoMessage = (message: ContentPhotoPayload) => {
  return (
    <>
      {message.content.url ? (
        <ImageOriginal imgUrl={message.content.url} />
      ) : (
        <ImagePreview uri={message.content.previewUrl} />
      )}
    </>
  );
};
