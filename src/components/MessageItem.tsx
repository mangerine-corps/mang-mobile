import { TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import Box from './Box';
import Text from './Text';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { Conversation } from '@/utils/types';
import { useAuth } from '@/state/hooks/user.hook';
import FastImage from 'react-native-fast-image';
import { useChat } from '@/state/hooks/chat';
import moment from 'moment';

interface Props {
  unread?: boolean;
  item: Conversation;
}

const MessageItem = ({ unread, item }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const { user } = useAuth();
  const { localConversations = [] } = useChat();
  const activeConversation = useMemo(
    () => localConversations?.find(x => x?.conversation?.id === item?.id),
    [localConversations, item],
  );
  const otherUser = useMemo(
    () => (item?.consultantId !== user?.id ? item?.consultant : item?.user),
    [item, user],
  );

  return (
    <Box>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatScreen', {
            conversation: item,
          })
        }>
        <Box
          flexDirection="row"
          borderRadius={8}
          gap="mid"
          padding="s"
          backgroundColor="primary_background"
          alignItems="stretch">
          <Box justifyContent="center">
            <Box
              height={50}
              width={50}
              overflow="hidden"
              borderRadius={50}
              backgroundColor="faded">
              <FastImage
                style={{ height: '100%', width: '100%' }}
                source={{
                  uri: otherUser?.profilePics,
                }}
              />
            </Box>
          </Box>
          <Box flex={1}>
            <Box
              flex={1}
              gap="l"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text variant="semibold" fontSize={16}>
                {otherUser?.fullName}
              </Text>
              <Text fontSize={12} color="label">
                {activeConversation?.lastMessage
                  ? moment(activeConversation?.lastMessage?.createdAt).format(
                      'hh:mm a',
                    )
                  : null}
              </Text>
            </Box>
            <Box flexDirection="row" gap="l" alignItems="flex-end">
              <Box flex={1}>
                <Text color="placeholder" numberOfLines={2}>
                  {activeConversation?.lastMessage?.content}
                </Text>
              </Box>
              <Box>
                {unread && (
                  <Box
                    height={24}
                    width={24}
                    borderRadius={24}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="foreground_primary">
                    <Text color="white" fontSize={16}>
                      2
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default MessageItem;
