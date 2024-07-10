import { Control, useWatch } from "react-hook-form";
import { SendAudioButton } from "./SendAudioButton";
import { SendMessageButton } from "./SendMessageButton";
import { ContentPayload } from "@/@types/types";
import { SendMessageToChannel } from "@/helpers/SendMessageToChannel";
import { USER_ID } from "@/supabase/supabase";
import { useMessagesActions } from "@/store/messageStore";
import { CreatePayloadData } from "@/helpers/createPayloadData";
type Props = {
  control: Control<ContentPayload, any>;
};
export const ToggleInputButtons = ({ control }: Props) => {
  const { addMessage } = useMessagesActions();
  const { content } = useWatch({
    control: control,
  });

  const onSubmit = async (data: ContentPayload) => {
    const newPayload = CreatePayloadData(data);
    if (data.user.id == USER_ID) {
      addMessage(newPayload);
    }
    SendMessageToChannel(newPayload);
    control._reset();
  };

  return (content?.message?.length as number) > 0 ? (
    <SendMessageButton onPress={control.handleSubmit(onSubmit)} />
  ) : (
    <SendAudioButton />
  );
};
