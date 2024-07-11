import { ContentPayload } from "@/@types/types";
import {
  Animated,
  ListRenderItemInfo,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Message } from "./Message/Message";
import { useMessages } from "@/store/messageStore";

import { forwardRef } from "react";

const renderItem = ({
  item,
  index,
  separators,
}: ListRenderItemInfo<ContentPayload>) => (
  <Message message={item} index={index} />
);

const renderSeparator = () => (
  <View
    style={{
      height: Dimensions.get("screen").height * 0.004,
    }}
  />
);

type Props = {};
type Ref = Animated.FlatList<ContentPayload>;

export const MessageList = forwardRef<Ref, Props>((props, ref) => {
  const messages = useMessages();

  return (
    <Animated.FlatList
      ref={ref}
      data={messages}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={(item, index) => item.content.id}
      style={[styles.messageList]}
    />
  );
});

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
    marginBottom: 16,
  },
});
