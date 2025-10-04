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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import Text from '@/components/Text';
import Input from '@/components/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useThemeColors } from '@/hooks/useTheme';
import Select from '@/components/Select';
import { useCreateAccountMutation } from '@/state/services/auth.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setAuthBlocked, setCredentials } from '@/state/reducers/user.reducer';
// import { useLocation } from '@/hooks/useTransformLocation';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import { useAuth } from '@/state/hooks/user.hook';
import MLogo from '@/assets/svgs/MLogo';
import {
  ActionSheetRef,
  ScrollView as SheetScroll,
} from 'react-native-actions-sheet';
import CheckBox from '@/components/CheckBox';
import BottomSheet from '@/components/BottomSheet';

const schema = yup
  .object({
    businessName: yup.string().max(255),
    userType: yup.string().max(255).required('Type is required'),
    location: yup.string().required('required'),
  })
  .required();

interface Props
  extends NativeStackScreenProps<MainStack, 'FinishRegistration'> {}

const FinishRegistrationScreen = ({ navigation, route }: Props) => {
  const { foreground, foreground_primary } = useThemeColors();
  const dispatch = useDispatch();
  const [create, { isLoading }] = useCreateAccountMutation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // const { cities } = useLocation();
  const { interestsLoading, loadInterests, userTypesLoading, loadUserTypes } =
    useLoadAuth();
  const { userTypes = [], interests = [] } = useAuth();
  const actionRef = useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      businessName: '',
      location: '',
      userType: '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const { businessName, location, userType } = cred;
        const { email, fullName, password } = route.params;
        if (!location || !userType || selectedInterests.length < 1) {
          showMessage({
            message: 'Fill all required fields to proceed',
            type: 'danger',
          });
          return;
        }
        const response = await create({
          body: {
            businessName,
            email,
            fullName,
            interests: selectedInterests,
            location,
            password,
            userType: [userTypes.find(t => t.name === userType)?.id!],
          },
        });
        // console.log('create account response:', JSON.stringify(response));
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
          setAuthBlocked({
            value: true,
          }),
        );
        dispatch(
          setCredentials({
            token: (response as any)?.data?.data?.token,
            user: (response as any)?.data?.data?.user,
          }),
        );
        navigation.navigate('SignupAvatar');
      } catch (error) {
        console.log('signup error:', error);
      }
    },
    [route.params, selectedInterests, create, userTypes, dispatch, navigation],
  );

  useEffect(() => {
    loadInterests();
  }, [loadInterests]);

  useEffect(() => {
    loadUserTypes();
  }, [loadUserTypes]);

  return (
    <BaseScreenComponent>
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
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box onStartShouldSetResponder={() => true}>
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        padding="l"
                        justifyContent="space-between">
                        <MLogo height={41} />
                        <TouchableOpacity onPress={() => navigation.pop(2)}>
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
                            width="50%"
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
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="businessName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                value={value}
                                onChangeText={onChange}
                                label="Business Name"
                                placeholder="Input business name"
                                error={errors?.businessName?.message}
                                rightComponent={
                                  <Box>
                                    <MaterialCommunityIcons
                                      name="account"
                                      size={24}
                                      color={foreground}
                                    />
                                  </Box>
                                }
                              />
                            )}
                          />
                        </Box>
                        <Box marginBottom="m">
                          <Text fontSize={12} color={'label'} marginBottom="s">
                            Area of interests
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              actionRef.current?.show();
                            }}>
                            <Box
                              // backgroundColor={disabled ? 'muted' : 'background'}
                              borderWidth={1}
                              borderRadius={8}
                              borderColor={'border'}
                              height={50}
                              backgroundColor="background"
                              overflow="hidden"
                              flexDirection="row"
                              justifyContent="space-between"
                              paddingHorizontal={'m'}
                              alignItems="center">
                              <Text variant="medium" numberOfLines={1}>
                                {selectedInterests
                                  .map(
                                    x =>
                                      interests.find(xx => xx.id === x)?.name ||
                                      x,
                                  )
                                  ?.join(', ') || 'Select Interests'}
                              </Text>
                            </Box>
                          </TouchableOpacity>
                          {/* <Box flexDirection="row" gap="s" flexWrap="wrap">
                            {interests.map(i => (
                              <TouchableOpacity key={i.id}>
                                <Box
                                  flexDirection="row"
                                  alignItems="center"
                                  gap="s">
                                  <Text>{i.name}</Text>
                                  <CheckBox size={20} />
                                </Box>
                              </TouchableOpacity>
                            ))}
                          </Box> */}
                          {interestsLoading && (
                            <Box padding="l" alignItems="center">
                              <ActivityIndicator
                                size="small"
                                color={foreground_primary}
                              />
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="userType"
                            render={({ field: { onChange, value } }) => (
                              <Select
                                error={errors?.userType?.message}
                                required
                                value={value}
                                onSelect={onChange}
                                label="Who are you?"
                                data={userTypes.map(x => ({
                                  title: x.name,
                                  value: x.name,
                                }))}
                              />
                            )}
                          />
                          {userTypesLoading && (
                            <Box padding="l" alignItems="center">
                              <ActivityIndicator
                                size="small"
                                color={foreground_primary}
                              />
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="location"
                            render={({ field: { onChange, value } }) => (
                              // <Select
                              //   error={errors?.location?.message}
                              //   required
                              //   search
                              //   label="Location"
                              //   onSelect={onChange}
                              //   data={cities.map(c => ({
                              //     title: `${c.name}, ${c.fullCountry}`,
                              //     value: `${c.name}, ${c.fullCountry}`,
                              //   }))}
                              //   value={value}

                              <Input
                                required
                                value={value}
                                onChangeText={onChange}
                                label="Location"
                                placeholder="Input Location"
                                error={errors?.location?.message}
                              />
                            )}
                          />
                        </Box>
                      </Box>
                      <Box paddingHorizontal="l" marginTop="30">
                        <Button
                          loading={isLoading}
                          displayText="Sign Up"
                          // onPress={() => navigation.navigate('SignupAvatar')}
                          onPress={handleSubmit(proceed)}
                        />
                      </Box>
                      <Box
                        marginVertical="l"
                        flexDirection="row"
                        paddingHorizontal="l"
                        gap="l"
                        alignItems="center">
                        <Box
                          flex={1}
                          borderBottomColor="label"
                          borderBottomWidth={1}
                        />
                        <Text color="label" fontSize={16} variant="semibold">
                          OR
                        </Text>
                        <Box
                          flex={1}
                          borderBottomColor="label"
                          borderBottomWidth={1}
                        />
                      </Box>
                      <Box marginBottom="mxl" paddingHorizontal="l" gap="mid">
                        <Text fontSize={16} marginTop="mid">
                          Already have an account?{' '}
                          <Text
                            onPress={() => navigation.navigate('Login')}
                            fontSize={16}
                            variant="bold"
                            color="foreground_primary">
                            Login
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
            <BottomSheet backgroundColor="background" ref={actionRef}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Box paddingVertical="l">
                  <Box
                    marginBottom="l"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Box flex={1}>
                      <Text variant="semibold" fontSize={20}>
                        Select Interests
                      </Text>
                    </Box>
                    <Box>
                      <TouchableOpacity
                        onPress={() => actionRef.current?.hide()}>
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
                    alignItems="flex-start"
                    gap="mid"
                    marginBottom="l">
                    <Box>
                      <MaterialCommunityIcons
                        name="checkbox-marked"
                        size={24}
                        color={foreground}
                      />
                    </Box>
                    <Box flex={1} flexDirection="row">
                      <Text variant="medium">
                        {selectedInterests
                          .map(
                            x => interests.find(xx => xx.id === x)?.name || x,
                          )
                          ?.join(', ') || 'Select Interests'}
                      </Text>
                    </Box>
                  </Box>
                  <Box maxHeight={550}>
                    <SheetScroll showsVerticalScrollIndicator={false}>
                      <Box
                        onStartShouldSetResponder={() => true}
                        gap="mid"
                        paddingBottom="xl">
                        {interests.map(d => (
                          <TouchableOpacity
                            key={d.id}
                            onPress={() => {
                              // actionRef.current?.hide();
                              const selected = selectedInterests.includes(d.id);
                              if (selected) {
                                setSelectedInterests(i =>
                                  i.filter(xx => xx !== d.id),
                                );
                              } else {
                                setSelectedInterests(x => [...x, d.id]);
                              }
                            }}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="mid">
                              <Box flex={1}>
                                <Text variant="semibold">{d.name}</Text>
                              </Box>
                              <Box>
                                <CheckBox
                                  onPress={() => {
                                    // actionRef.current?.hide();
                                    const selected = selectedInterests.includes(
                                      d.id,
                                    );
                                    if (selected) {
                                      setSelectedInterests(i =>
                                        i.filter(xx => xx !== d.id),
                                      );
                                    } else {
                                      setSelectedInterests(x => [...x, d.id]);
                                    }
                                  }}
                                  size={20}
                                  checked={selectedInterests.includes(d.id)}
                                />
                              </Box>
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </SheetScroll>
                  </Box>
                  <Box paddingHorizontal="l" marginBottom="xl">
                    <Button
                      displayText="Done"
                      onPress={() => {
                        actionRef.current?.hide();
                      }}
                    />
                  </Box>
                </Box>
              </TouchableWithoutFeedback>
            </BottomSheet>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default FinishRegistrationScreen;
