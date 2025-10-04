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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useThemeColors } from '@/hooks/useTheme';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '@/state/hooks/user.hook';
import { ErrorData } from '@/utils/types';
import { useUpdateProfilePicMutation } from '@/state/services/onboarding.service';
import { showMessage } from 'react-native-flash-message';
import MLogo from '@/assets/svgs/MLogo';

interface Props extends NativeStackScreenProps<MainStack, 'SignupAvatar'> {}

const SignupAvatarScreen = ({ navigation }: Props) => {
  const { label } = useThemeColors();
  const [avatar, setAvatar] = useState<Asset[]>([]);
  const { user } = useAuth();
  const [upload, { isLoading }] = useUpdateProfilePicMutation();

  const selectAvatar = async () => {
    const pick = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.4,
    });
    if (pick?.assets) {
      setAvatar(pick?.assets);
    }
  };

  const updatePic = useCallback(async () => {
    try {
      if (avatar.length < 1) {
        return;
      }
      const body = new FormData();
      body.append('file', {
        uri: avatar[0].uri!.replace(Platform.OS === 'ios' ? 'file://' : '', ''),
        name: avatar[0].fileName!,
        type: avatar[0].type!,
      });
      const response = await upload({
        body,
      });
      console.log('updatePic response:', JSON.stringify(response));
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
      navigation.navigate('SignupResume');
    } catch (error) {
      console.log('avatar upload error:', error);
    }
  }, [avatar, navigation, upload]);

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
                            width="65%"
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
                          Let’s get to know you
                        </Text>
                        <Text color="label" fontSize={16}>
                          Upload a profile picture
                        </Text>
                      </Box>
                      <Box paddingHorizontal="l">
                        <Box alignItems="center" marginBottom="m">
                          <TouchableOpacity onPress={selectAvatar}>
                            <Box
                              height={100}
                              width={100}
                              borderRadius={100}
                              justifyContent="center"
                              alignItems="center"
                              overflow="hidden">
                              {avatar?.length > 0 ? (
                                <Image
                                  source={{ uri: avatar[0].uri }}
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                  }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name="account"
                                  size={64}
                                  color={label}
                                />
                              )}
                            </Box>
                          </TouchableOpacity>
                        </Box>
                        <Box>
                          <Text
                            fontSize={24}
                            variant="semibold"
                            textAlign="center">
                            {user?.fullName}
                          </Text>
                        </Box>
                        <Box
                          marginTop="mid"
                          flexDirection="row"
                          alignItems="center"
                          gap="xs"
                          justifyContent="center">
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={20}
                            color={label}
                          />
                          <Text color="label">{user?.location}</Text>
                        </Box>
                      </Box>
                      <Box paddingHorizontal="l" marginTop="30" gap="l">
                        <Button
                          loading={isLoading}
                          disabled={avatar.length < 1}
                          displayText="Next"
                          onPress={updatePic}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('SignupResume');
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

export default SignupAvatarScreen;
