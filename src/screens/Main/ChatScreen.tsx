import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SectionList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Text from '@/components/Text';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { Menu, MenuItem } from 'react-native-material-menu';
import ConfirmModal from '@/components/ConfirmModal';
import ReportModal from '@/components/ReportModal';
import { useCreateAppointmentConversationMutation } from '@/state/services/appointment.service';
import { useAuth } from '@/state/hooks/user.hook';
import { Conversation, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';
import { useChat } from '@/state/hooks/chat';
import { useLoadConversations } from '@/state/hooks/loadchat.hook';
import FastImage from 'react-native-fast-image';
import { orderBy } from 'lodash';
import moment from 'moment';
import ChatBubbles from '@/components/ChatBubbles';
import { useSocketContext } from '@/state/context/SocketProvider';
import AgoraCallModal from '@/components/AgoraCallModal';
import BottomSheet from '@/components/BottomSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  useDeleteUploadMutation,
  useSignUploadMutation,
} from '@/state/services/uploads.service';
import { makeid } from '@/utils/helpers';
import { pick } from '@react-native-documents/picker';
import { useCreateUploadMutation } from '@/state/services/freedom.service';

const ChatScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'ChatScreen'>) => {
  const {
    foreground,
    foreground_primary,
    placeholder,
    danger,
    background,
    label,
  } = useThemeColors();
  const { regular } = useThemeText();
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportUser, setReportUser] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [message, setMessage] = useState('');
  const [appointmentConversation] = useCreateAppointmentConversationMutation();
  const { user } = useAuth();
  const [createdConvo, setCreatedConvo] = useState<Conversation>();
  const { conversations = [], localConversations = [] } = useChat();
  const { loadConversations, loadMessages } = useLoadConversations();
  const { socket } = useSocketContext();
  const [startCall, setStartCall] = useState(false);
  const menuRef = useRef<ActionSheetRef>(null);
  const [attachments, setAttachments] = useState<
    {
      resource_type: string;
      secure_url: string;
      display_name: string;
      url: string;
      publicId: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    }[]
  >([]);
  const [signUpload, { isLoading: signingLoading }] = useSignUploadMutation();
  const [upload, { isLoading: uploadLoading }] = useCreateUploadMutation();
  const [deleteMedia, { isLoading: deleteLoading }] = useDeleteUploadMutation();
  const activeConversation = useMemo(
    () =>
      createdConvo ||
      conversations?.find(
        x =>
          x?.id === route?.params?.conversation?.id &&
          route?.params?.conversation !== undefined,
      ),
    [conversations, route, createdConvo],
  );
  const activeLocalConversation = useMemo(
    () =>
      localConversations?.find(
        x => x?.conversation?.id === activeConversation?.id,
      ),
    [localConversations, activeConversation],
  );

  const otherUser = useMemo(
    () =>
      activeConversation?.consultantId === user?.id
        ? activeConversation?.user
        : activeConversation?.consultant,
    [activeConversation, user],
  );
  const orderedMessages = useMemo(
    () => orderBy(activeLocalConversation?.messages || [], 'createdAt', 'desc'),
    [activeLocalConversation],
  );

  const distinctDates = useMemo(
    () =>
      [
        ...new Map(
          orderedMessages.map(item => [
            new Date(item.createdAt).toDateString(),
            item,
          ]),
        ).values(),
      ].map(s => new Date(s.createdAt).toDateString()),
    [orderedMessages],
  );

  const sectionedMessages = useMemo(
    () =>
      distinctDates
        .sort(function compare(a, b) {
          var dateA = new Date(a).getTime();
          var dateB = new Date(b).getTime();
          return dateB - dateA;
        })
        .map(d => ({
          title:
            moment().toDate().toDateString() === d
              ? 'Today'
              : moment().subtract(1, 'day').toDate().toDateString() === d
              ? 'Yesterday'
              : moment(d).format('ddd MMM D YYYY'),
          data: [
            ...orderedMessages.filter(
              o => new Date(o.createdAt).toDateString() === d,
            ),
          ].sort(function compare(a, b) {
            var dateA = new Date(a.createdAt).getTime();
            var dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          }),
        })),
    [distinctDates, orderedMessages],
  );

  const createConvo = useCallback(async () => {
    try {
      if (!user?.id || !route?.params?.appointment?.id) {
        return;
      }
      console.log('create convo params', {
        appointmentId: route?.params?.appointment?.id,
        participantId: user?.id,
      });
      const response = await appointmentConversation({
        // body: {},
        params: {
          appointmentId: route?.params?.appointment?.id,
          participantId: user?.id,
        },
      });
      console.log('createconvo response', response);
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      setCreatedConvo((response as any)?.data?.data || undefined);
      loadConversations();
    } catch (error) {
      console.log('create convo error', JSON.stringify(error));
    }
  }, [appointmentConversation, route, user, loadConversations]);

  const uploadFile = useCallback(
    async (file: { uri: string; type: string; name: string; size: number }) => {
      try {
        if (!file?.uri) {
          return;
        }
        const signingID = `chat_${makeid(21)}`;
        const createSigningResponse = await signUpload({
          body: {
            folder: 'chat-uploads',
            tags: ['chat', 'user-upload'],
            public_id: signingID,
          },
        });
        console.log('signing response', createSigningResponse);
        const exampleSigning = {
          signature: 'x',
          timestamp: 1,
          cloudName: 'x',
          apiKey: 'x',
        };
        if (createSigningResponse?.error) {
          const err = createSigningResponse as ErrorData;
          showMessage({
            message:
              err?.error?.data?.message ||
              err?.error?.data?.error ||
              'Something went wrong',
            type: 'danger',
          });
          return;
        }
        const uploadBody = new FormData();
        const signedRes = createSigningResponse?.data as typeof exampleSigning;
        uploadBody.append('api_key', signedRes.apiKey);
        uploadBody.append('timestamp', signedRes.timestamp);
        uploadBody.append('signature', signedRes.signature);
        uploadBody.append('folder', 'chat-uploads');
        uploadBody.append('public_id', signingID);
        uploadBody.append('tags', 'chat,user-upload');
        uploadBody.append('file', file);
        const response = await upload({
          body: uploadBody,
          cloudName: signedRes.cloudName,
        });
        if (response?.error) {
          const err = response as ErrorData;
          showMessage({
            message:
              err?.error?.data?.message ||
              err?.error?.data?.error ||
              'Something went wrong',
            type: 'danger',
          });
          return;
        }
        setAttachments(x => [
          ...x,
          {
            ...(response as any)?.data,
            resource_type: (response as any)?.data?.resource_type,
            secure_url: (response as any)?.data?.secure_url,
            display_name: (response as any)?.data?.display_name,
            url: (response as any)?.data?.secure_url,
            publicId: (response as any)?.data?.display_name,
            fileType: file.type,
            fileName: file.name,
            fileSize: file.size,
          },
        ]);
      } catch (error) {
        console.log('upload catch', JSON.stringify(error));
      }
    },
    [signUpload, upload],
  );

  const selectMedia = async (type = 'gallery' as 'gallery' | 'camera') => {
    const pickImage = await (type === 'gallery'
      ? launchImageLibrary({
          mediaType: 'photo',
          quality: 0.4,
        })
      : launchCamera({
          mediaType: 'photo',
          quality: 0.4,
        }));
    if (!pickImage?.assets && (pickImage?.assets?.length || 0) < 1) {
      return;
    }
    pickImage?.assets?.forEach(async asset => {
      try {
        await uploadFile({
          name: asset.fileName!,
          type: asset.type!,
          uri: asset.uri!,
          size: asset.fileSize || 0,
        });
      } catch (error) {
        console.log('upload flow error', error);
      }
    });
  };

  const selectDoc = async () => {
    const picked = await pick({
      allowMultiSelection: false,
      mode: 'import',
    });
    if (picked) {
      picked?.map(async pickedItem => {
        try {
          await uploadFile({
            name: pickedItem.name || '',
            type: pickedItem.type!,
            uri: pickedItem.uri!,
            size: pickedItem.size || 0,
          });
        } catch (error) {
          console.log('upload doc error', error);
        }
      });
    }
  };

  const deleteAttachMent = useCallback(
    async (index: number) => {
      try {
        const preDelete = [...attachments];
        setAttachments(x => x.filter((_, i) => i !== index));
        const response = await deleteMedia({
          body: {
            publicIds: [preDelete[index].display_name],
          },
        });
        if (response?.error) {
          const err = response as ErrorData;
          showMessage({
            message:
              err?.error?.data?.message ||
              err?.error?.data?.error ||
              'Something went wrong',
            type: 'danger',
          });
          setAttachments(preDelete);
          return;
        }
      } catch (error) {
        console.log('remove attachment error', error);
      }
    },
    [attachments, deleteMedia],
  );

  const sendMessage = useCallback(() => {
    if (!message?.trim() || !activeConversation || !socket) {
      return;
    }
    socket?.emit('sendMessage', {
      conversationId: activeConversation?.id,
      content: message,
      receiverId: otherUser?.id,
      ...(attachments?.length > 0
        ? {
            attachments: attachments.map(x => ({
              url: x.url,
              publicId: x.publicId,
              fileType: x.fileType,
              fileName: x.fileName,
              fileSize: x.fileSize,
            })),
          }
        : {}),
    });
    setMessage('');
    setAttachments([]);
  }, [activeConversation, message, otherUser?.id, socket, attachments]);

  useFocusEffect(
    useCallback(() => {
      if (!route?.params?.conversation) {
        console.log('createconvo called');
        createConvo();
      }
    }, [route, createConvo]),
  );

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation, loadMessages]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <ReportModal
            isVisible={reportUser}
            closeModal={() => setReportUser(false)}
            reportId={''}
            type="user"
          />
          <ConfirmModal
            closeModal={() => setConfirmBlock(false)}
            isVisible={confirmBlock}
            title={'Are you sure you want to block this user?'}
            subtitle="You won't be able to see their profile or messages, and they won't be able to contact you."
            confirmButton="Yes, block"
            confirm={() => {
              setConfirmBlock(false);
            }}
          />
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <Box
                  flexDirection="row"
                  paddingHorizontal="l"
                  gap="s"
                  alignItems="center">
                  <Box>
                    <TouchableOpacity
                      onPress={navigation.goBack}
                      style={{ padding: 8, paddingLeft: 0 }}>
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={24}
                        color={foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1} flexDirection="row" gap="s" alignItems="center">
                    <Box
                      height={40}
                      width={40}
                      borderRadius={40}
                      overflow="hidden"
                      backgroundColor="faded">
                      <FastImage
                        source={{ uri: otherUser?.profilePics }}
                        style={{ height: '100%', width: '100%' }}
                      />
                    </Box>
                    <Box>
                      <Text variant="medium">{otherUser?.fullName}</Text>
                      <Text fontSize={12} color="label">
                        {/* Last seen 8:42 */}
                      </Text>
                    </Box>
                  </Box>
                  <Box flexDirection="row" gap="mid" alignItems="center">
                    <TouchableOpacity onPress={() => setStartCall(true)}>
                      <Box paddingVertical="m">
                        <FontelloCocoIcon
                          name="video"
                          size={24}
                          color={foreground_primary}
                        />
                      </Box>
                    </TouchableOpacity>
                    <Menu
                      style={{
                        backgroundColor: background,
                      }}
                      visible={menuVisible}
                      anchor={
                        <TouchableOpacity onPress={() => setMenuVisible(true)}>
                          <Box>
                            <MaterialCommunityIcons
                              name="dots-vertical"
                              size={24}
                              color={foreground_primary}
                            />
                          </Box>
                        </TouchableOpacity>
                      }
                      onRequestClose={() => setMenuVisible(false)}>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                          setTimeout(() => {
                            setReportUser(true);
                          }, 900);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <MaterialCommunityIcons
                            name="flag-outline"
                            size={18}
                            color={foreground}
                          />
                          <Text>Report User</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <FontelloCocoIcon
                            name="volume-cross"
                            size={18}
                            color={foreground}
                          />
                          <Text>Mute conversation</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                          setTimeout(() => {
                            setConfirmBlock(true);
                          }, 900);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <MaterialCommunityIcons
                            name="minus-circle-outline"
                            size={18}
                            color={foreground}
                          />
                          <Text>Block user</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                          // setTimeout(() => {
                          //   setConfirmBlock(true);
                          // }, 900);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color={danger}
                          />
                          <Text>Delete conversation</Text>
                        </Box>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <Box flex={1} backgroundColor="faded_border">
                  <SectionList
                    onStartShouldSetResponder={() => true}
                    // ref={sectionListRef}
                    inverted
                    contentContainerStyle={{
                      paddingVertical: 24,
                      paddingHorizontal: 24,
                      gap: 24,
                    }}
                    renderSectionFooter={({ section: { title } }) => (
                      <Box
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Box
                          backgroundColor="button_primary"
                          style={{
                            height: 22,
                            justifyContent: 'center',
                            paddingHorizontal: 12,
                            borderRadius: 4,
                          }}>
                          <Text variant="bold" fontSize={12} color="background">
                            {title?.toUpperCase()}
                          </Text>
                        </Box>
                      </Box>
                    )}
                    sections={sectionedMessages}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity activeOpacity={1}>
                          <ChatBubbles item={item} />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </Box>
                {attachments.length > 0 ? (
                  <Box borderBottomWidth={1} borderBottomColor="faded_border">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <Box
                        gap="m"
                        flexDirection="row"
                        height={80}
                        alignItems="center"
                        paddingHorizontal="l">
                        {attachments.map((a, i) => (
                          <Box
                            borderWidth={2}
                            position="relative"
                            borderColor="faded_border"
                            key={a.secure_url}
                            height={65}
                            width={60}
                            borderRadius={6}
                            justifyContent="center"
                            alignItems="center">
                            {a.resource_type?.includes('image') ? (
                              <FastImage
                                source={{ uri: a.secure_url }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 6,
                                  overflow: 'hidden',
                                }}
                              />
                            ) : (
                              <Box>
                                <Feather
                                  name="file-text"
                                  size={24}
                                  color={foreground_primary}
                                />
                              </Box>
                            )}
                            <Box position="absolute" top={-10} right={-10}>
                              <TouchableOpacity
                                onPress={() => deleteAttachMent(i)}>
                                <Box
                                  height={20}
                                  width={20}
                                  borderRadius={20}
                                  backgroundColor="foreground_primary"
                                  justifyContent="center"
                                  alignItems="center">
                                  <MaterialCommunityIcons
                                    name="close"
                                    size={14}
                                    color={background}
                                  />
                                </Box>
                              </TouchableOpacity>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </ScrollView>
                  </Box>
                ) : null}
                <Box
                  paddingVertical="mid"
                  gap="mid"
                  paddingHorizontal="l"
                  flexDirection="row"
                  alignItems="center">
                  <Box>
                    <TouchableOpacity
                      onPress={() => menuRef.current?.show()}
                      style={{ paddingVertical: 8, paddingLeft: 0 }}>
                      {uploadLoading || signingLoading || deleteLoading ? (
                        <Box>
                          <ActivityIndicator
                            size="small"
                            color={foreground_primary}
                          />
                        </Box>
                      ) : (
                        <MaterialCommunityIcons
                          name="plus"
                          size={24}
                          color={foreground}
                        />
                      )}
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1}>
                    <Box
                      height={40}
                      borderRadius={8}
                      flexDirection="row"
                      alignItems="stretch"
                      backgroundColor="faded_border">
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 12,
                          paddingHorizontal: 12,
                          fontFamily: regular.fontFamily,
                        }}
                        placeholder="Write a message"
                        placeholderTextColor={placeholder}
                        value={message}
                        onChangeText={setMessage}
                      />
                    </Box>
                  </Box>
                  <Box flexDirection="row" gap="mid" alignItems="center">
                    <TouchableOpacity>
                      <Box paddingVertical="m">
                        <FontelloCocoIcon
                          name="mic"
                          size={24}
                          color={foreground_primary}
                        />
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sendMessage}>
                      <Box paddingVertical="m">
                        <FontelloCocoIcon
                          name="send"
                          size={24}
                          color={foreground_primary}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            </KeyboardAvoidingView>

            {activeConversation && (
              <AgoraCallModal
                caller={user?.id!}
                conversation={activeConversation!}
                isVisible={startCall}
                closeModal={() => setStartCall(false)}
              />
            )}
            <BottomSheet backgroundColor="background" ref={menuRef}>
              <Box paddingVertical="l">
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Box flex={1}>
                    <Text variant="semibold" fontSize={20}>
                      Select Option
                    </Text>
                  </Box>
                  <Box>
                    <TouchableOpacity onPress={() => menuRef.current?.hide()}>
                      <Box>
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={20}
                          color={foreground_primary}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box paddingVertical="l" gap="m">
                  <TouchableOpacity
                    onPress={() => {
                      menuRef.current?.hide();
                      setTimeout(() => {
                        selectMedia('camera');
                      }, 800);
                    }}>
                    <Box flexDirection="row" paddingBottom="m">
                      <Box flex={1}>
                        <Text fontSize={18}>Take a photo</Text>
                      </Box>
                      <Box>
                        <Feather name="camera" size={24} color={label} />
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      menuRef.current?.hide();
                      setTimeout(() => {
                        selectMedia('gallery');
                      }, 800);
                    }}>
                    <Box flexDirection="row" paddingBottom="m">
                      <Box flex={1}>
                        <Text fontSize={18}>Choose from gallery</Text>
                      </Box>
                      <Box>
                        <Feather name="image" size={24} color={label} />
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      menuRef.current?.hide();
                      setTimeout(() => {
                        selectDoc();
                      }, 800);
                    }}>
                    <Box flexDirection="row" paddingBottom="m">
                      <Box flex={1}>
                        <Text fontSize={18}>Upload File</Text>
                      </Box>
                      <Box>
                        <Feather name="file" size={24} color={label} />
                      </Box>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </BottomSheet>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ChatScreen;
