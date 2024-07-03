import { IFormInput } from "@/app/(tabs)";

export type TMessage = IFormInput;

export enum contentType {
  message = "message",
  photo = "photo",
  video = "video",
}
