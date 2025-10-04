import {
  Image,
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
import Input from '@/components/Input';
import EnvelopeSVG from '@/assets/svgs/EnvelopeSVG';
import EyeSVG from '@/assets/svgs/EyeSVG';
import CheckBox from '@/components/CheckBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useThemeColors } from '@/hooks/useTheme';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import YupPassword from 'yup-password';
import { usePreSignupMutation } from '@/state/services/auth.service';
import { showMessage } from 'react-native-flash-message';
import { ErrorData } from '@/utils/types';
import MLogo from '@/assets/svgs/MLogo';
// import Popover from 'react-native-popover-view';
YupPassword(yup);

const schema = yup
  .object({
    // fullName: yup.string().max(255).required('Full name is required'),
    firstName: yup.string().max(255).required('First name is required'),
    middleName: yup.string().max(255),
    lastName: yup.string().max(255).required('Last name is required'),
    email: yup
      .string()
      .email('Emter a valid email')
      .max(255)
      .required('Email is required'),
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

interface Props extends NativeStackScreenProps<MainStack, 'Signup'> {}

const SignupScreen = ({ navigation }: Props) => {
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  // const [showPopover, setShowPopover] = useState(true);
  const { foreground } = useThemeColors();
  const [presignup, { isLoading }] = usePreSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const {
          email,
          password,
          confirmPassword,
          firstName,
          middleName,
          lastName,
        } = cred;

        if (!rememberMe) {
          showMessage({
            message: 'Kindly agree to our terms to proceed',
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
        if (!firstName.trim() || !lastName.trim()) {
          showMessage({
            message: 'Enter a valid full name',
            type: 'danger',
          });
          return;
        }

        const fullName = `${firstName}${
          middleName ? ' ' + middleName : ''
        } ${lastName}`;

        const response = await presignup({
          body: { email },
        });
        console.log('signup response:', JSON.stringify(response));
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
        navigation.navigate('SignupOTP', {
          email,
          fullName,
          password,
        });
      } catch (error) {
        console.log('signup error:', error);
      }
    },
    [navigation, presignup, rememberMe],
  );

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
                            width="30%"
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
                          Create your Mangerine account.
                        </Text>
                      </Box>
                      <Box paddingHorizontal="l">
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="firstName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                error={errors.firstName?.message}
                                label="First Name"
                                required
                                value={value}
                                onChangeText={onChange}
                                placeholder="Enter First Name"
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
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="middleName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                error={errors.middleName?.message}
                                label="Middle Name"
                                value={value}
                                onChangeText={onChange}
                                placeholder="Enter Middle Name"
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
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="lastName"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                error={errors.lastName?.message}
                                label="Last Name"
                                required
                                value={value}
                                onChangeText={onChange}
                                placeholder="Enter Last Name"
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
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                error={errors.email?.message}
                                value={value}
                                onChangeText={onChange}
                                label="Email Address"
                                required
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="johndoe@gmail.com"
                                rightComponent={
                                  <Box>
                                    <EnvelopeSVG />
                                  </Box>
                                }
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
                                value={value}
                                onChangeText={onChange}
                                label="Password"
                                error={errors.password?.message}
                                secureTextEntry={secure}
                                required
                                placeholder="Enter Password"
                                rightComponent={
                                  <TouchableOpacity
                                    style={{
                                      height: '100%',
                                      justifyContent: 'center',
                                    }}
                                    onPress={() => setSecure(!secure)}>
                                    <EyeSVG filled={!secure} />
                                  </TouchableOpacity>
                                }
                                subtext="Password must be at least 8 characters long and include at least one uppercase letter (A - Z)."
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
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                value={value}
                                onChangeText={onChange}
                                label="Confirm Password"
                                error={errors.confirmPassword?.message}
                                secureTextEntry={secure2}
                                required
                                placeholder="Confirm Password"
                                rightComponent={
                                  <TouchableOpacity
                                    style={{
                                      height: '100%',
                                      justifyContent: 'center',
                                    }}
                                    onPress={() => setSecure2(!secure2)}>
                                    <EyeSVG filled={!secure2} />
                                  </TouchableOpacity>
                                }
                              />
                            )}
                          />
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingHorizontal="l">
                        <Box flexDirection="row" gap="s" alignItems="center">
                          <CheckBox
                            size={20}
                            checked={rememberMe}
                            onPress={() => setRememberMe(!rememberMe)}
                          />
                          <Text>
                            I agree to the{' '}
                            <Text color="foreground_primary">
                              Terms & Conditions
                            </Text>
                          </Text>
                        </Box>
                      </Box>
                      <Box paddingHorizontal="l" marginTop="30">
                        <Button
                          loading={isLoading}
                          displayText="Sign Up"
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
                        <Button buttonProps={{ backgroundColor: 'white' }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <Image
                              style={{ height: 23, width: 23 }}
                              resizeMode="contain"
                              source={require('@/assets/images/googlr-logo.png')}
                            />
                            <Text
                              variant="semibold"
                              color="label"
                              fontSize={16}>
                              Login with Google
                            </Text>
                          </Box>
                        </Button>
                        <Button buttonProps={{ backgroundColor: 'white' }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <Ionicons
                              name="logo-apple"
                              color={'#000000'}
                              size={24}
                            />
                            <Text
                              variant="semibold"
                              color="label"
                              fontSize={16}>
                              Login with Apple
                            </Text>
                          </Box>
                        </Button>
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
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default SignupScreen;
