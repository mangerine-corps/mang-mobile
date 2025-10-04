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
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useLoginMutation } from '@/state/services/auth.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useDispatch } from 'react-redux';
import { setAuthBlocked, setCredentials } from '@/state/reducers/user.reducer';
import MLogo from '@/assets/svgs/MLogo';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Emter a valid email')
      .max(255)
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

interface Props extends NativeStackScreenProps<MainStack, 'Login'> {}

const LoginScreen = ({ navigation }: Props) => {
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: any) => {
      try {
        const response = await login({
          body: {
            password: cred.password,
            username: cred.email,
          },
        });
        console.log('login response:', JSON.stringify(response));
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
            value: false,
          }),
        );
        dispatch(
          setCredentials({
            token: (response as any)?.data?.data?.token,
            user: (response as any)?.data?.data?.user,
          }),
        );
        // navigation.navigate('Tabs', {
        //   screen: 'Home',
        // });
      } catch (error) {
        console.log('login error:', error);
      }
    },
    [login, dispatch],
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
                      <Box flexDirection="row" alignItems="center" padding="l">
                        <MLogo height={41} />
                      </Box>
                      <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                        <Text fontSize={24} variant="semibold">
                          Welcome Back!
                        </Text>
                        <Text color="label" fontSize={16}>
                          Login to your account to continue
                        </Text>
                      </Box>
                      <Box paddingHorizontal="l">
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                label="Email Address"
                                required
                                autoCapitalize="none"
                                error={errors.email?.message}
                                placeholder="johndoe@gmail.com"
                                rightComponent={
                                  <Box>
                                    <EnvelopeSVG />
                                  </Box>
                                }
                                value={value}
                                onChangeText={onChange}
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
                                label="Password"
                                secureTextEntry={secure}
                                required
                                placeholder="123!gv2"
                                error={errors.password?.message}
                                rightComponent={
                                  <TouchableOpacity
                                    onPress={() => setSecure(!secure)}>
                                    <EyeSVG filled={secure} />
                                  </TouchableOpacity>
                                }
                                value={value}
                                onChangeText={onChange}
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
                          <Text>Remember me</Text>
                        </Box>
                        <Box>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ForgotPassword')
                            }>
                            <Text>Forget Password?</Text>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                      <Box paddingHorizontal="l" marginTop="30">
                        <Button
                          loading={isLoading}
                          displayText="Login"
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
                          Don’t have an account?{' '}
                          <Text
                            fontSize={16}
                            variant="bold"
                            color="foreground_primary"
                            onPress={() => navigation.navigate('Signup')}>
                            Sign Up
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

export default LoginScreen;
