export enum ContentType {
  message = "message",
  photo = "photo",
  video = "video",
}

type contentBase = {
  id: string;
  date: string;
};

export type contentMessage = contentBase & {
  type: ContentType.message;
  message: string;
};

export type contentPhoto = contentBase & {
  type: ContentType.photo;
  message: string;
  url: string;
  previewUrl: string;
  meta: {
    localUri: string;
  };
};

export type contentVideo = contentBase & {
  type: ContentType.video;
  message: string;
  url: string;
  previewUrl: string;
  meta: {
    localUri: string;
  };
};

export type ContentPayload = {
  content: contentMessage | contentPhoto | contentVideo;
  user: {
    id: string;
  };
};

export type ContentMessagePayload = ContentPayload & {
  content: contentMessage;
};

export type ContentPhotoPayload = ContentPayload & {
  content: contentPhoto;
};

export type ContentVideoPayload = ContentPayload & {
  content: contentVideo;
};

export type Channels = "public:chat";
