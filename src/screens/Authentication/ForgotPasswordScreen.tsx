import {
  Keyboard,
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
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { validateEmail } from '@/utils/helpers';
import { useForgotPasswordMutation } from '@/state/services/auth.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import MLogo from '@/assets/svgs/MLogo';

interface Props extends NativeStackScreenProps<MainStack, 'ForgotPassword'> {}

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [errored, setErrored] = useState(false);
  const [forgot, { isLoading }] = useForgotPasswordMutation();

  const proceed = useCallback(async () => {
    try {
      if (!email.trim()) {
        return;
      }
      if (!validateEmail(email)) {
        setErrored(true);
        return;
      }

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
      navigation.navigate('ForgotPasswordOTP', {
        email,
        otpHash: (response as any)?.data?.data?.otpHash,
      });
    } catch (error) {
      console.log('ForgotPasswordScreen proceed error:', error);
    }
  }, [email, forgot, navigation]);

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
                        Forgot Password?
                      </Text>
                      <Text color="label" fontSize={16}>
                        Input your email address below to receive your password
                        reset instruction.
                      </Text>
                    </Box>
                    <Box paddingHorizontal="l">
                      <Box>
                        <Input
                          value={email}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="email-address"
                          label="Email Address"
                          textContentType="emailAddress"
                          onChangeText={setEmail}
                          required
                          error={errored ? 'Enter a valid email' : undefined}
                          placeholder="johndoe@gmail.com"
                          rightComponent={
                            <Box>
                              <EnvelopeSVG />
                            </Box>
                          }
                        />
                      </Box>
                    </Box>
                    <Box paddingHorizontal="l" marginTop="30" gap="l">
                      <Button
                        loading={isLoading}
                        onPress={proceed}
                        disabled={!email.trim()}
                        displayText="Continue"
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

export default ForgotPasswordScreen;
