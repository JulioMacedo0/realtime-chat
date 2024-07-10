import { ContentPayload } from "@/@types/types";
import * as Crypto from "expo-crypto";
export const CreatePayloadData = (payload: ContentPayload) => {
  const now = new Date();
  const newPayload: ContentPayload = {
    content: {
      ...payload.content,
      date: now.toISOString(),
      id: Crypto.randomUUID(),
    },
    user: payload.user,
  };
  console.log(newPayload, "new payload");
  return newPayload;
};
