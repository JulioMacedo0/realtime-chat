export enum contentType {
  message = "message",
  photo = "photo",
  video = "video",
}

type contentBase = {
  id: string;
  date: string;
};

export type contentMessage = contentBase & {
  type: contentType.message;
  message: string;
};

export type contentPhoto = {
  type: contentType.photo;
  message: string;
  url: string;
  previewUrl: string;
  meta: {
    localUri: string;
  } & contentBase;
};

export type contentVideo = {
  type: contentType.video;
  message: string;
  url: string;
  previewUrl: string;
  meta: {
    localUri: string;
  };
} & contentBase;

export type ContentPayload = {
  content: contentMessage | contentPhoto | contentVideo;
  user: {
    id: string;
  };
};

export type ContentMessagePayload = {
  content: contentMessage;
} & ContentPayload;

export type ContentPhotoPayload = {
  content: contentPhoto;
} & ContentPayload;

export type ContentVideoPayload = {
  content: contentVideo;
} & ContentPayload;
