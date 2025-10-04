import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import Text from '@/components/Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useThemeColors } from '@/hooks/useTheme';
import {
  pick,
  DocumentPickerResponse,
  types,
} from '@react-native-documents/picker';
import Input from '@/components/Input';
import SuccessModal from '@/components/SuccessModal';
import { useUpdateProfileDetailsMutation } from '@/state/services/onboarding.service';
import { showMessage } from 'react-native-flash-message';
import { ErrorData } from '@/utils/types';
import { useDispatch } from 'react-redux';
import { setAuthBlocked, setAuthTrigger } from '@/state/reducers/user.reducer';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import MLogo from '@/assets/svgs/MLogo';

interface Props extends NativeStackScreenProps<MainStack, 'SignupResume'> {}

const SignupResumeScreen = ({ navigation }: Props) => {
  const { foreground_primary } = useThemeColors();
  const [resume, setResume] = useState<DocumentPickerResponse[]>([]);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [updateDetails, { isLoading }] = useUpdateProfileDetailsMutation();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState<Asset[]>([]);

  const selectAvatar = async () => {
    const p = await launchImageLibrary({
      mediaType: 'video',
      quality: 0.4,
      videoQuality: 'low',
    });
    if (p?.assets) {
      setAvatar(p?.assets);
    }
  };
  // console.log('isLoading', isLoading);

  const selectResume = async () => {
    const picked = await pick({
      allowMultiSelection: false,
      mode: 'import',
      type: [types.doc, types.docx, types.pdf],
    });
    if (picked) {
      setResume(picked);
    }
  };

  const completeSignup = useCallback(async () => {
    try {
      if (resume.length < 1 || avatar.length < 1) {
        return;
      }
      if (!title.trim() || !description.trim()) {
        showMessage({
          message: 'Fill all fields to proceed',
          type: 'danger',
        });
        return;
      }
      const body = new FormData();
      body.append('title', title);
      body.append('description', description);
      body.append('resume', {
        uri: resume[0].uri!.replace(Platform.OS === 'ios' ? 'file://' : '', ''),
        name: resume[0].name!,
        type: resume[0].type!,
      });
      body.append('video', {
        uri: avatar[0].uri!.replace(Platform.OS === 'ios' ? 'file://' : '', ''),
        name: avatar[0].fileName!,
        type: avatar[0].type!,
      });
      const response = await updateDetails({
        body,
      });
      console.log('completeSignup response:', JSON.stringify(response));
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
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      setSuccess(true);
    } catch (error) {
      console.log('avatar upload error:', error);
    }
  }, [description, resume, title, updateDetails, dispatch, avatar]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SuccessModal
            isVisible={success}
            closeModal={() => {
              setSuccess(false);
              setTimeout(() => {
                dispatch(
                  setAuthBlocked({
                    value: false,
                  }),
                );
              }, 850);
            }}
            title="Registration Successful!"
            subtitle="Your account has successfully been created. Enjoy features on Mangerine. "
            buttonText="Go to Home"
          />
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box onStartShouldSetResponder={() => true}>
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        padding="l"
                        justifyContent="space-between">
                        <MLogo height={41} />
                        <TouchableOpacity onPress={navigation.goBack}>
                          <Text color="label">Cancel</Text>
                        </TouchableOpacity>
                      </Box>

                      <Box paddingHorizontal="l">
                        <Box
                          height={10}
                          borderRadius={10}
                          flexDirection="row"
                          alignItems="stretch"
                          style={{ backgroundColor: '#B5B9C7' }}>
                          <Box
                            backgroundColor="foreground_primary"
                            borderRadius={10}
                            width="100%"
                          />
                          <Box
                            height={20}
                            width={20}
                            borderRadius={20}
                            borderWidth={4}
                            borderColor="foreground_primary"
                            style={{
                              marginTop: -5,
                              backgroundColor: '#B5B9C7',
                              marginLeft: -10,
                            }}></Box>
                        </Box>
                      </Box>
                      <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                        <Text fontSize={24} variant="semibold">
                          Sign Up
                        </Text>
                        <Text color="label" fontSize={16}>
                          Finish your registration.
                        </Text>
                      </Box>
                      <Box paddingHorizontal="l">
                        <Box>
                          <Input
                            value={title}
                            required
                            label="What best describe your current title"
                            placeholder="Describe your current title"
                            onChangeText={setTitle}
                          />
                        </Box>
                        <Box>
                          <Input
                            label="Enter a value statement"
                            required
                            placeholder="Input your value statement"
                            value={description}
                            onChangeText={setDescription}
                          />
                        </Box>
                        <Box>
                          <Button
                            onPress={selectResume}
                            buttonProps={{
                              backgroundColor: 'background',
                              borderWidth: 1,
                              borderColor: 'foreground_primary',
                            }}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              justifyContent="center"
                              gap="s">
                              <MaterialCommunityIcons
                                name={resume.length ? 'check' : 'plus'}
                                size={24}
                                color={foreground_primary}
                              />
                              <Text
                                variant="semibold"
                                fontSize={16}
                                color="foreground_primary">
                                {resume.length
                                  ? resume[0].name
                                  : 'Upload Resume'}
                              </Text>
                            </Box>
                          </Button>
                        </Box>
                        <Box marginTop="m">
                          <Button
                            onPress={selectAvatar}
                            buttonProps={{
                              backgroundColor: 'background',
                              borderWidth: 1,
                              borderColor: 'foreground_primary',
                            }}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              justifyContent="center"
                              gap="s">
                              <MaterialCommunityIcons
                                name={avatar.length ? 'check' : 'plus'}
                                size={24}
                                color={foreground_primary}
                              />
                              <Text
                                variant="semibold"
                                fontSize={16}
                                color="foreground_primary">
                                {avatar.length
                                  ? avatar[0].fileName
                                  : 'Upload Video'}
                              </Text>
                            </Box>
                          </Button>
                        </Box>
                      </Box>
                      <Box paddingHorizontal="l" marginTop="30" gap="l">
                        <Button
                          disabled={resume.length < 1}
                          displayText="Sign Up"
                          loading={isLoading}
                          onPress={completeSignup}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              setAuthTrigger({
                                trigger: true,
                              }),
                            );
                            dispatch(
                              setAuthBlocked({
                                value: false,
                              }),
                            );
                          }}>
                          <Box alignItems="center">
                            <Text variant="semibold" fontSize={16}>
                              Skip
                            </Text>
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default SignupResumeScreen;
