import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { OtpInput } from 'react-native-otp-entry';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import useCountDown from 'react-countdown-hook';
import { getFormattedTime } from '@/utils/helpers';
import {
  useForgotPasswordMutation,
  useVerifyEmailOTPMutation,
} from '@/state/services/auth.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import MLogo from '@/assets/svgs/MLogo';

const initialTime = 4 * 60 * 1000; // initial time in milliseconds, defaults to 60000
const interval = 1000; // interval to change remaining time amount, defaults to 1000

interface Props
  extends NativeStackScreenProps<MainStack, 'ForgotPasswordOTP'> {}

const ForgotPasswordOTPScreen = ({ navigation, route }: Props) => {
  const [timeLeft, { start, reset }] = useCountDown(initialTime, interval);
  const [code, setCode] = useState('');
  const { foreground_primary, border, foreground } = useThemeColors();
  const { regular } = useThemeText();
  const [forgot, { isLoading: resendLoading }] = useForgotPasswordMutation();
  const [verify, { isLoading }] = useVerifyEmailOTPMutation();

  const resend = useCallback(async () => {
    try {
      const { email } = route.params;
      const response = await forgot({
        email,
      });
      // console.log('signup response:', JSON.stringify(response));
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
      reset();
      start();
    } catch (error) {
      console.log('ForgotPasswordScreen proceed error:', error);
    }
  }, [forgot, reset, route.params, start]);

  const verifyCode = useCallback(async () => {
    try {
      if (code.length < 6) {
        return;
      }
      const { email } = route.params;
      const verifyresponse = await verify({
        email,
        otpCode: code,
      });
      // console.log('verifyCode response:', JSON.stringify(verifyresponse));
      if (verifyresponse?.error) {
        const err = verifyresponse as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      navigation.navigate('ResetPassword', {
        email,
      });
    } catch (error) {
      console.log('verifyCode error:', error);
    }
  }, [code, navigation, route.params, verify]);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
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
                    <Box paddingVertical="l" paddingHorizontal="l" gap="s">
                      <Text fontSize={24} variant="semibold">
                        OTP Verification
                      </Text>
                      <Text color="label" fontSize={16}>
                        Input the code sent to{' '}
                        <Text color="foreground_primary" fontSize={16}>
                          {route.params.email}
                        </Text>{' '}
                        to verify your email
                      </Text>
                    </Box>
                    <Box paddingHorizontal="l">
                      <OtpInput
                        numberOfDigits={6}
                        // secureTextEntry
                        onTextChange={setCode}
                        autoFocus
                        focusColor={foreground_primary}
                        type="numeric"
                        theme={{
                          pinCodeContainerStyle: {
                            borderColor: border,
                            height: 48,
                            width: 48,
                            borderRadius: 6,
                          },
                          focusedPinCodeContainerStyle: {
                            borderColor: foreground_primary,
                          },
                          pinCodeTextStyle: {
                            fontSize: 20,
                            color: foreground,
                            fontFamily: regular.fontFamily,
                          },
                        }}
                      />
                    </Box>
                    <Box alignItems="center" marginTop="l" gap="s">
                      <Text>
                        Expires in{' '}
                        <Text color="danger">
                          {getFormattedTime(timeLeft / 1000)}
                        </Text>{' '}
                        minute(s)
                      </Text>
                      <Text>
                        Didn’t receive a code?{' '}
                        <Text
                          disabled={timeLeft > 0}
                          variant="bold"
                          onPress={() => resend()}
                          color="foreground_primary">
                          Resend
                        </Text>
                      </Text>
                    </Box>
                    {resendLoading && (
                      <Box padding="l" alignItems="center">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                    <Box paddingHorizontal="l" marginTop="30" gap="l">
                      <Button
                        disabled={code.trim().length !== 6}
                        displayText="Verify"
                        onPress={verifyCode}
                        loading={isLoading}
                      />
                      <Box alignItems="center">
                        <Text
                          variant="bold"
                          color="foreground_primary"
                          onPress={navigation.goBack}>
                          Back
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
            </Box>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ForgotPasswordOTPScreen;
