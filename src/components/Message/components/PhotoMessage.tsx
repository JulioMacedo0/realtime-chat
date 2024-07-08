import { ContentPhotoPayload } from "@/@types/types";
import { ImagePreview } from "./ImagePreview";
import { ImageOriginal } from "./ImageOriginal";
import { USER_ID } from "@/supabase/supabase";

type Props = {
  message: ContentPhotoPayload;
};

export const PhotoMessage = ({ message }: Props) => {
  const isUserMessage = message.user.id == USER_ID;

  return (
    <>
      {isUserMessage ? (
        <ImageOriginal imgUrl={message.content.meta.localUri} />
      ) : (
        <ImagePreview uri={message.content.previewUrl} />
      )}
    </>
  );
};
