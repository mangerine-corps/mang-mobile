import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Box from '@/components/Box';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList, MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import BottomTabHeader from '@/components/BottomTabHeader';
import MessageItem from '@/components/MessageItem';
import ScaledImage from '@/components/ScaledImage';
import Text from '@/components/Text';
import Button from '@/components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActionSheetRef,
  ScrollView as SheetScroll,
} from 'react-native-actions-sheet';
import BottomSheet from '@/components/BottomSheet';
import { useThemeColors } from '@/hooks/useTheme';
import { useGetMyAppointmentsMutation } from '@/state/services/appointment.service';
import { Appointment, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { uniqBy } from 'lodash';
import FastImage from 'react-native-fast-image';
import { useLoadConversations } from '@/state/hooks/loadchat.hook';
import { useChat } from '@/state/hooks/chat';

interface Props extends BottomTabScreenProps<BottomTabList, 'Message'> {}

const MessageScreen = ({}: Props) => {
  const [tab, setTab] = useState('all');
  const { foreground, foreground_primary } = useThemeColors();
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const actionRef = useRef<ActionSheetRef>(null);
  const [getAppointments, {}] = useGetMyAppointmentsMutation();
  const limit = 500;
  const apptpage = 1;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [constSearch, setConstSearch] = useState('');
  const { conversationsLoading, loadConversations } = useLoadConversations();
  const { conversations = [] } = useChat();
  console.log('appointments', appointments);

  const uniqueConsultantAppointments = useMemo(
    () =>
      uniqBy(appointments, 'consultantId')?.filter(x =>
        x?.consultant?.fullName
          ?.toLowerCase()
          ?.includes(constSearch?.toLowerCase()),
      ),
    [appointments, constSearch],
  );

  const loadAppointments = useCallback(async () => {
    try {
      const response = await getAppointments({
        params: {
          limit,
          page: apptpage,
          status: 'UPCOMING',
        },
      });
      console.log('appointments response', JSON.stringify(response));
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
      setAppointments((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getAppointments]);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments]),
  );

  useFocusEffect(
    useCallback(() => {
      console.log('focus call');
      loadConversations();
    }, [loadConversations]),
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1} position="relative">
                <BottomTabHeader />
                <Box flex={1} position="relative">
                  {conversationsLoading && conversations.length === 0 && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  {conversations.length > 0 && (
                    <Box
                      flexDirection="row"
                      paddingHorizontal="l"
                      gap="mid"
                      marginBottom="l">
                      <Box
                        paddingBottom="s"
                        paddingHorizontal="mid"
                        borderBottomColor={
                          tab === 'all' ? 'foreground_primary' : 'transparent'
                        }
                        borderBottomWidth={1}>
                        <TouchableOpacity onPress={() => setTab('all')}>
                          <Text
                            variant="semibold"
                            color={
                              tab === 'all' ? 'foreground_primary' : 'faded'
                            }>
                            All messages
                          </Text>
                        </TouchableOpacity>
                      </Box>
                      <Box
                        paddingBottom="s"
                        paddingHorizontal="mid"
                        borderBottomColor={
                          tab === 'unread'
                            ? 'foreground_primary'
                            : 'transparent'
                        }
                        borderBottomWidth={1}>
                        <TouchableOpacity onPress={() => setTab('unread')}>
                          <Text
                            variant="semibold"
                            color={
                              tab === 'unread' ? 'foreground_primary' : 'faded'
                            }>
                            Unread messages
                          </Text>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )}
                  <FlatList
                    onStartShouldSetResponder={() => true}
                    contentContainerStyle={{
                      paddingHorizontal: 24,
                      gap: 8,
                      paddingBottom: 24,
                    }}
                    style={{
                      flex: 1,
                    }}
                    data={conversations}
                    renderItem={({ item }) => <MessageItem item={item} />}
                    ListEmptyComponent={
                      <Box minHeight={500} justifyContent="center">
                        <Box alignItems="center">
                          <ScaledImage
                            height={200}
                            source={require('@/assets/images/empty-messages.png')}
                          />
                        </Box>
                        <Box paddingHorizontal="l">
                          <Text
                            fontSize={20}
                            variant="semibold"
                            textAlign="center">
                            Welcome to Your Messages
                          </Text>
                          <Text textAlign="center" color="label" marginTop="s">
                            Start new conversations, manage messages, and stay
                            connected. Tap 'New Message' to begin.
                          </Text>
                          <Box marginTop="mxl">
                            <Button
                              displayText="New Message"
                              onPress={() => {
                                actionRef.current?.show();
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  {conversations.length > 0 && (
                    <Box position="absolute" bottom={20} right={30}>
                      <TouchableOpacity
                        onPress={() => {
                          actionRef.current?.show();
                        }}>
                        <Box
                          paddingHorizontal="m"
                          height={50}
                          borderRadius={100}
                          backgroundColor="primary"
                          alignItems="center"
                          flexDirection="row"
                          gap="s">
                          <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color="#FFFFFF"
                          />
                          <Text variant="bold" fontSize={12} color="white">
                            Add Message
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  )}
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
          <BottomSheet
            onClose={() => {
              setConstSearch('');
            }}
            backgroundColor="background"
            ref={actionRef}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Box paddingVertical="l">
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Box flex={1}>
                    <Text variant="semibold" fontSize={20}>
                      New Message
                    </Text>
                  </Box>
                  <Box>
                    <TouchableOpacity onPress={() => actionRef.current?.hide()}>
                      <Box>
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={20}
                          color={foreground}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  gap="mid"
                  marginBottom="l">
                  <Box>
                    <MaterialCommunityIcons
                      name="magnify"
                      size={24}
                      color={foreground}
                    />
                  </Box>
                  <Box flex={1} flexDirection="row" alignItems="stretch">
                    <TextInput
                      value={constSearch}
                      onChangeText={setConstSearch}
                      style={{ flex: 1 }}
                    />
                  </Box>
                </Box>
                <Box maxHeight={550}>
                  <SheetScroll showsVerticalScrollIndicator={false}>
                    <Box
                      onStartShouldSetResponder={() => true}
                      gap="mid"
                      paddingBottom="xl">
                      {uniqueConsultantAppointments.map(c => {
                        return (
                          <TouchableOpacity
                            key={c.consultantId}
                            onPress={() => {
                              // actionRef.current?.hide();
                              // console.log('sjsnd');
                              // console.log('navigate params', {
                              //   user: c.consultant,
                              //   appointment: c,
                              // });
                              setTimeout(() => {
                                mainNavigation.navigate('ChatScreen', {
                                  user: c.consultant,
                                  appointment: c,
                                });
                              }, 900);
                            }}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="mid">
                              <Box
                                height={42}
                                borderRadius={42}
                                overflow="hidden"
                                backgroundColor="label"
                                width={42}>
                                <FastImage
                                  style={{ height: '100%', width: '100%' }}
                                  source={{
                                    uri: c.consultant.profilePics || '',
                                  }}
                                />
                              </Box>
                              <Box flex={1}>
                                <Text variant="semibold">
                                  {c.consultant.fullName}
                                </Text>
                                <Text variant="medium" color="label">
                                  {c.consultant.title}
                                </Text>
                              </Box>
                            </Box>
                          </TouchableOpacity>
                        );
                      })}
                      {/* {dummyData.map(d => (
                        <TouchableOpacity
                          key={d}
                          onPress={() => {
                            actionRef.current?.hide();
                            setTimeout(() => {
                              mainNavigation.navigate('ChatScreen');
                            }, 900);
                          }}>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <Box
                              height={42}
                              borderRadius={42}
                              backgroundColor="label"
                              width={42}></Box>
                            <Box flex={1}>
                              <Text variant="semibold">Jacob Jones</Text>
                              <Text variant="medium" color="label">
                                Web Designer
                              </Text>
                            </Box>
                          </Box>
                        </TouchableOpacity>
                      ))} */}
                    </Box>
                  </SheetScroll>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          </BottomSheet>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default MessageScreen;
