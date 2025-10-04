import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import { useAuth } from '@/state/hooks/user.hook';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import YupPassword from 'yup-password';
import {
  useAddSecondaryNumberMutation,
  usePatchPasswordMutation,
  useRemoveSecondaryNumberMutation,
  useUpdateSecondaryNumberMutation,
} from '@/state/services/setting.service';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import { showMessage } from 'react-native-flash-message';
import { ErrorData } from '@/utils/types';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

YupPassword(yup);

const schema = yup
  .object({
    oldPassword: yup.string().max(255).required('Password is required'),
    password: yup
      .string()
      .password()
      .min(8, 'Password must be at least 8 characters long')
      .minUppercase(1, 'Password must have at least one uppercase character')
      .minNumbers(0, 'No numbers')
      .minSymbols(0, 'No symbols')
      .minLowercase(0, 'No lowercase')
      .required('required'),
    confirmPassword: yup
      .string()
      .password()
      .min(8, 'Password must be at least 8 characters long')
      .minUppercase(1, 'Password must have at least one uppercase character')
      .minNumbers(0, 'No numbers')
      .minSymbols(0, 'No symbols')
      .minLowercase(0, 'No lowercase')
      .required('required'),
  })
  .required();

const fieldsType = schema.getDefault();

type Fields = keyof typeof fieldsType;

type FieldKeys = {
  // eslint-disable-next-line no-unused-vars
  [key in Fields]: string;
};

const AccountSettingScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'AccountSettings'>) => {
  const { foreground, foreground_primary, danger } = useThemeColors();
  const { user } = useAuth();
  const [changePass, { isLoading }] = usePatchPasswordMutation();
  const dispatch = useDispatch();
  const [addSecondary, setAddSecondary] = useState(false);
  const [secondary, setSecondary] = useState(user?.secondaryNumber || '');
  const [confirmSecondary, setConfirmSecondary] = useState('');
  const [postSecondary, { isLoading: secondaryLoading }] =
    useAddSecondaryNumberMutation();
  const [deleteSecondary, { isLoading: deleteLoading }] =
    useRemoveSecondaryNumberMutation();
  const [updateSecondary, { isLoading: updateLoading }] =
    useUpdateSecondaryNumberMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const submit = useCallback(
    async (cred: any) => {
      try {
        if (!cred) {
          return;
        }

        const { oldPassword, password, confirmPassword } = cred as FieldKeys;
        if (!oldPassword || !password || !confirmPassword) {
          showMessage({
            message: 'Fill all fields to continue',
            type: 'danger',
          });
          return;
        }
        if (password !== confirmPassword) {
          showMessage({
            message: 'Passwords do not match',
            type: 'danger',
          });
          return;
        }
        const response = await changePass({
          body: {
            oldPassword,
            password,
          },
          id: user?.id!,
        });
        // console.log('response', JSON.stringify(response));
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
        resetForm();
        showMessage({
          message: 'Profile updated',
          type: 'success',
        });
      } catch (error) {
        console.log('group error:', error);
      }
    },
    [changePass, user?.id, dispatch, resetForm],
  );

  const newSecondary = useCallback(async () => {
    try {
      if (!secondary || !confirmSecondary) {
        showMessage({
          message: 'Fill all fields to continue',
          type: 'danger',
        });
        return;
      }
      if (secondary !== confirmSecondary) {
        showMessage({
          message: 'Numbers do not match',
          type: 'danger',
        });
        return;
      }
      const response = await postSecondary({
        body: {
          secondaryNumber: secondary,
          confirmSecondaryNumber: confirmSecondary,
        },
      });
      // console.log('response', JSON.stringify(response));
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
      showMessage({
        message: 'Profile updated',
        type: 'success',
      });
      setAddSecondary(false);
    } catch (error) {
      console.log('secondary error:', error);
    }
  }, [postSecondary, dispatch, secondary, confirmSecondary]);

  const changeSecondary = useCallback(async () => {
    try {
      if (!secondary || !confirmSecondary) {
        showMessage({
          message: 'Fill all fields to continue',
          type: 'danger',
        });
        return;
      }
      if (secondary !== confirmSecondary) {
        showMessage({
          message: 'Numbers do not match',
          type: 'danger',
        });
        return;
      }
      const response = await updateSecondary({
        body: {
          secondaryNumber: secondary,
          confirmSecondaryNumber: confirmSecondary,
        },
      });
      // console.log('response', JSON.stringify(response));
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
      showMessage({
        message: 'Profile updated',
        type: 'success',
      });
      setAddSecondary(false);
    } catch (error) {
      console.log('secondary error:', error);
    }
  }, [updateSecondary, dispatch, secondary, confirmSecondary]);

  const removeSecondary = useCallback(async () => {
    try {
      const response = await deleteSecondary({});
      // console.log('response', JSON.stringify(response));
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
      showMessage({
        message: 'Profile updated',
        type: 'success',
      });
      setAddSecondary(false);
    } catch (error) {
      console.log('secondary error:', error);
    }
  }, [deleteSecondary, dispatch]);

  useEffect(() => {
    if (!addSecondary) {
      setSecondary('');
      setConfirmSecondary('');
    }
  }, [addSecondary]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <DeleteConfirmModal
            closeModal={() => setConfirmDelete(false)}
            title="Are you sure you want to remove your secondary phone number?"
            subtitle="This number will no longer be used for account recovery or notifications."
            confirmDelete={() => {
              setConfirmDelete(false);
              setTimeout(() => {
                removeSecondary();
              }, 900);
            }}
            isVisible={confirmDelete}
          />
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={15}
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
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={{ padding: 8, paddingLeft: 0 }}>
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={24}
                        color={foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1} alignItems="center">
                    <Text
                      variant="semibold"
                      fontSize={20}
                      textTransform="capitalize">
                      Account Setting
                    </Text>
                  </Box>
                  <Box padding="s" width={32} opacity={0}></Box>
                </Box>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box paddingVertical="l" paddingHorizontal="l">
                      <Box marginBottom="l">
                        <Text variant="semibold" fontSize={18} marginBottom="m">
                          Phone Number Management
                        </Text>
                        <Box gap="mid">
                          <Box>
                            <Text fontSize={16}>Primary Phone Number</Text>
                            <Text color="label">{user?.mobileNumber}</Text>
                          </Box>
                          <Box>
                            {deleteLoading && (
                              <Box padding="l" alignItems="center">
                                <ActivityIndicator
                                  size="small"
                                  color={foreground_primary}
                                />
                              </Box>
                            )}
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              marginBottom="mid"
                              alignItems="center">
                              <Text fontSize={16}>Secondary Phone Number</Text>
                              {user?.secondaryNumber && (
                                <Box
                                  flexDirection="row"
                                  alignItems="center"
                                  gap="mid">
                                  <TouchableOpacity
                                    onPress={() => setAddSecondary(true)}>
                                    <Box
                                      width={40}
                                      height={40}
                                      borderRadius={6}
                                      backgroundColor="primary_background"
                                      justifyContent="center"
                                      alignItems="center">
                                      <FontelloCocoIcon
                                        name="edit-1"
                                        size={24}
                                        color={foreground_primary}
                                      />
                                    </Box>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setConfirmDelete(true)}>
                                    <Box
                                      width={40}
                                      height={40}
                                      borderRadius={6}
                                      backgroundColor="primary_background"
                                      justifyContent="center"
                                      alignItems="center">
                                      <MaterialCommunityIcons
                                        name="trash-can-outline"
                                        size={24}
                                        color={danger}
                                      />
                                    </Box>
                                  </TouchableOpacity>
                                </Box>
                              )}
                            </Box>
                            {user?.secondaryNumber ? (
                              <Box>
                                {!addSecondary && (
                                  <Text color="label">
                                    {user?.secondaryNumber}
                                  </Text>
                                )}
                                {addSecondary && (
                                  <Box paddingTop="l">
                                    <Box>
                                      <Input
                                        label="Secondary Phone Number"
                                        value={secondary}
                                        onChangeText={setSecondary}
                                      />
                                    </Box>
                                    <Box>
                                      <Input
                                        label="Confirm Phone Number"
                                        value={confirmSecondary}
                                        onChangeText={setConfirmSecondary}
                                      />
                                    </Box>
                                    <Box>
                                      <Button
                                        onPress={changeSecondary}
                                        loading={updateLoading}
                                        displayText="Save Changes"
                                      />
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Box>
                                {!addSecondary && (
                                  <Text color="label">
                                    No secondary phone number added. Consider
                                    adding one for extra security.{' '}
                                    <Text
                                      color="foreground_primary"
                                      onPress={() => setAddSecondary(true)}>
                                      Add secondary number
                                    </Text>
                                  </Text>
                                )}
                                {addSecondary && (
                                  <Box paddingTop="l">
                                    <Box>
                                      <Input
                                        label="Secondary Phone Number"
                                        value={secondary}
                                        onChangeText={setSecondary}
                                      />
                                    </Box>
                                    <Box>
                                      <Input
                                        label="Confirm Phone Number"
                                        value={confirmSecondary}
                                        onChangeText={setConfirmSecondary}
                                      />
                                    </Box>
                                    <Box>
                                      <Button
                                        onPress={newSecondary}
                                        loading={secondaryLoading}
                                        displayText="Save Changes"
                                      />
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box marginBottom="l">
                        <Text variant="semibold" fontSize={18} marginBottom="m">
                          Change Password
                        </Text>
                        <Text color="label" marginBottom="m">
                          Update your password to ensure your account remains
                          secured.
                        </Text>
                        <Box>
                          <Box>
                            <Controller
                              control={control}
                              rules={{
                                required: true,
                              }}
                              name="oldPassword"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  borderColor="faded"
                                  label="Current Password"
                                  value={value}
                                  onChangeText={onChange}
                                  error={errors.oldPassword?.message}
                                  secureTextEntry
                                  placeholder="•••••••••••"
                                />
                              )}
                            />
                          </Box>
                          <Box>
                            <Controller
                              control={control}
                              rules={{
                                required: true,
                              }}
                              name="password"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  borderColor="faded"
                                  label="New Password"
                                  value={value}
                                  onChangeText={onChange}
                                  error={errors.password?.message}
                                  secureTextEntry
                                  placeholder="•••••••••••"
                                />
                              )}
                            />
                          </Box>
                          <Box marginBottom="xl">
                            <Controller
                              control={control}
                              rules={{
                                required: true,
                              }}
                              name="confirmPassword"
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  borderColor="faded"
                                  label="Confirm Password"
                                  value={value}
                                  onChangeText={onChange}
                                  error={errors.confirmPassword?.message}
                                  secureTextEntry
                                  placeholder="•••••••••••"
                                />
                              )}
                            />
                          </Box>
                          <Box>
                            <Button
                              loading={isLoading}
                              onPress={handleSubmit(submit)}
                              displayText="Save Changes"
                            />
                          </Box>
                        </Box>
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

export default AccountSettingScreen;
