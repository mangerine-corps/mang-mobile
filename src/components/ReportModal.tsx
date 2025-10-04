import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useRef, useState } from 'react';
import Box from '@/components/Box';
import Modal from './Modal';
import Text from './Text';
import { useReportPostMutation } from '@/state/services/posts.service';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import Input from './Input';
import { useAuth } from '@/state/hooks/user.hook';
import { ErrorData } from '@/utils/types';
import FlashMessage from 'react-native-flash-message';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  type: 'user' | 'post';
  reportId: string;
}

const ReportModal = ({ isVisible, closeModal, type, reportId }: Props) => {
  const { foreground, faded } = useThemeColors();
  const [reportPost, { isLoading: reportpostLoading }] =
    useReportPostMutation();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const { user } = useAuth();
  const flashRef = useRef<FlashMessage>(null);

  const reasons = [
    {
      title: 'Inappropriate Content',
      subtitle:
        'Content that is violent, sexually explicit, or otherwise inappropriate.',
    },
    {
      title: 'Harassment or Bullying',
      subtitle: 'Behavior that targets and intimidates another user.',
    },
    {
      title: 'Misinformation',
      subtitle: 'False or misleading information that could cause harm.',
    },
    {
      title: 'Hate Speech or Discrimination',
      subtitle:
        'Content that promotes hate or discrimination based on race, gender, etc.',
    },
    {
      title: 'Illegal Activity',
      subtitle: 'Content promoting or involving illegal acts.',
    },
    {
      title: 'Spam or Scam',
      subtitle: 'Posts or messages that are misleading or fraudulent.',
    },
    {
      title: 'Other',
      subtitle: 'Any other issue not covered above',
    },
  ];

  const reportThisUser = useCallback(async () => {
    try {
    } catch (error) {}
  }, []);

  const reportThisPost = useCallback(async () => {
    try {
      const response = await reportPost({
        body: {
          postId: reportId,
          reportDetails: otherReason || reason,
          userId: user?.id!,
        },
        id: reportId,
      });
      console.log('reportPost response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        flashRef.current?.showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      closeModal && closeModal();
    } catch (error) {
      console.log('report post error:', error);
    }
  }, [closeModal, otherReason, reason, reportId, reportPost, user?.id]);

  return (
    <Modal
      flashRef={flashRef}
      onBackButtonPress={closeModal}
      isVisible={isVisible}
      style={{ margin: 0 }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
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
                  alignItems="center"
                  paddingHorizontal="l"
                  gap="mid"
                  paddingVertical="mid">
                  <Box>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={{ padding: 8, paddingLeft: 0 }}>
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={24}
                        color={foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1}>
                    <Text
                      variant="semibold"
                      fontSize={20}
                      textTransform="capitalize">
                      Report {type}
                    </Text>
                    <Text color="label">Help us understand the issue.</Text>
                  </Box>
                </Box>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box onStartShouldSetResponder={() => true}>
                      <Box gap="m">
                        {reasons.map(r => (
                          <TouchableOpacity
                            key={r.title}
                            onPress={() => {
                              setOtherReason('');
                              setReason(r.title);
                            }}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="l"
                              paddingHorizontal="l">
                              <Box gap="xs" flex={1}>
                                <Text variant="semibold" fontSize={16}>
                                  {r.title}
                                </Text>
                                <Text>{r.subtitle}</Text>
                              </Box>
                              <Box>
                                <MaterialCommunityIcons
                                  name={
                                    reason === r.title
                                      ? 'radiobox-marked'
                                      : 'radiobox-blank'
                                  }
                                  size={16}
                                  color={
                                    reason === r.title ? foreground : faded
                                  }
                                />
                              </Box>
                            </Box>
                          </TouchableOpacity>
                        ))}
                        {reason === 'Other' && (
                          <Box paddingHorizontal="l" marginBottom="l">
                            <Input
                              multiline
                              height={120}
                              textAlignVertical="top"
                              placeholder="Please specify the issue"
                              backgroundColor="background"
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
            <Box
              marginTop="mid"
              flexDirection="row"
              marginBottom="xl"
              gap="l"
              paddingHorizontal="l">
              <Box flex={1}>
                <Button
                  onPress={closeModal}
                  displayText="Cancel"
                  buttonProps={{
                    backgroundColor: 'faded',
                  }}
                />
              </Box>
              <Box flex={1}>
                <Button
                  loading={reportpostLoading}
                  disabled={
                    !reason ||
                    (reason === 'Other' && otherReason.trim().length < 1)
                  }
                  displayText="Submit report"
                  onPress={() => {
                    if (type === 'post') {
                      reportThisPost();
                    } else {
                      reportThisUser();
                    }
                  }}
                />
              </Box>
            </Box>
          </SafeAreaView>

          <FlashMessage position="top" />
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReportModal;
