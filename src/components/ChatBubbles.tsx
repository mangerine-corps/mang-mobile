import { Linking, Platform, Share, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Box from './Box';
import { MessageType } from '@/utils/types';
import { useAuth } from '@/state/hooks/user.hook';
import Text from './Text';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import { useThemeColors } from '@/hooks/useTheme';
import ViewImageModal from './ViewImageModal';
import * as mime from 'react-native-mime-types';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface Props {
  item: MessageType;
}

const ChatBubbles = ({ item }: Props) => {
  const { user } = useAuth();
  const { foreground_primary } = useThemeColors();
  const [showMedia, setShowMedia] = useState(false);
  const [chatMedia, setChatMedia] = useState('');

  const readFile = async (path: string) => {
    try {
      const finalLink = path[0] === '/' ? 'file://' + path : path;
      if (Platform.OS === 'android') {
        if (finalLink.includes('http')) {
          await Linking.openURL(finalLink);
          return;
        }
        await ReactNativeBlobUtil.android.actionViewIntent(
          finalLink.replace('file://', ''),
          mime.contentType(finalLink) || '',
        );
      } else {
        setTimeout(async () => {
          try {
            await Share.share({
              title: 'Chat Media',
              message: '',
              url: path.replace('file://', ''),
            });
          } catch (error) {
            console.log('share error:', error);
          }
        }, 900);
      }
    } catch (error) {
      console.log('read error', error);
    }
  };

  return (
    <Box
      flexDirection="row"
      justifyContent={user?.id === item.senderId ? 'flex-end' : 'flex-start'}>
      <ViewImageModal
        closeModal={() => {
          setShowMedia(false);
          setChatMedia('');
        }}
        isVisible={showMedia}
        media={chatMedia}
      />
      <Box
        maxWidth="75%"
        paddingVertical="s"
        style={{
          backgroundColor: user?.id === item.senderId ? '#FFFAF5' : '#FAFAFA',
        }}
        borderBottomRightRadius={user?.id === item.senderId ? 0 : 12}
        borderBottomLeftRadius={user?.id !== item.senderId ? 0 : 12}
        paddingHorizontal="mid"
        borderRadius={12}>
        <TouchableOpacity>
          <Box>
            {item?.attachments.length > 0 ? (
              <TouchableOpacity
                style={{ marginBottom: 16 }}
                onPress={() => {
                  if (
                    item?.attachments?.[0]?.mimeType
                      ?.toLowerCase()
                      ?.includes('image')
                  ) {
                    setChatMedia(item?.attachments?.[0].url);
                    setShowMedia(true);
                  } else {
                    readFile(item?.attachments?.[0].url);
                  }
                }}>
                <Box alignItems="center">
                  {item?.attachments?.[0]?.mimeType
                    ?.toLowerCase()
                    ?.includes('image') ? (
                    <FastImage
                      style={{
                        height: 150,
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: 6,
                        minWidth: 135,
                      }}
                      resizeMode="contain"
                      source={{
                        uri: item?.attachments?.[0]?.url,
                      }}
                    />
                  ) : (
                    <Box flexDirection="row" alignItems="center" gap="s">
                      <Box>
                        <Feather
                          name="file-text"
                          size={24}
                          color={foreground_primary}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text>{item?.attachments?.[0]?.fileName}</Text>
                      </Box>
                    </Box>
                  )}
                </Box>
              </TouchableOpacity>
            ) : null}
            <Box>
              <Box>
                <Text color="black">{item.content}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="flex-end">
                <Text fontSize={12} color="label">
                  {moment(item.createdAt).format('HH:mm')}
                </Text>
              </Box>
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default ChatBubbles;
