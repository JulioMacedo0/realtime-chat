import { ContentPayload } from "@/@types/types";
import { supabase } from "@/supabase/supabase";

export const SendMessageToChannel = async (payload: ContentPayload) => {
  const resp = await supabase.channel("public:chat").send({
    type: "broadcast",
    event: "message",
    payload,
  });

  return resp;
};
