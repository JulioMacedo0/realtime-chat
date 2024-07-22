import { Channels, ContentPayload } from "@/@types/types";
import { supabase } from "@/supabase/supabase";

type Params = {
  payload: ContentPayload;
  channel: Channels;
};

export const SendMessageToChannel = async ({ payload, channel }: Params) => {
  const resp = await supabase.channel(channel).send({
    type: "broadcast",
    event: "message",
    payload,
  });

  return resp;
};
