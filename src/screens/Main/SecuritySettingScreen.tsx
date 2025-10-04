import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';

const SecuritySettingscreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'SecuritySettings'>) => {
  const { foreground } = useThemeColors();

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
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
                  Security Setting
                </Text>
              </Box>
              <Box padding="s" width={32} opacity={0}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l" paddingHorizontal="l">
                  <Box marginBottom="xl">
                    <Text variant="semibold" fontSize={18} marginBottom="s">
                      Two-Factor Authentication (2FA)
                    </Text>
                    <Text>
                      Enhance your account security by setting up 2FA. Protect
                      your information with an additional layer of defense.
                    </Text>
                  </Box>
                  <Box marginBottom="xl">
                    <Box>
                      <Box
                        flexDirection="row"
                        marginBottom="s"
                        alignItems="center"
                        justifyContent="space-between">
                        <Text variant="semibold" fontSize={16}>
                          Email Address
                        </Text>
                        <Text variant="semibold" fontSize={16}>
                          Activate
                        </Text>
                      </Box>
                    </Box>
                    <Text color="label">
                      Add an extra layer of protection with a secure code sent
                      directly to your email.
                    </Text>
                  </Box>
                  <Box marginBottom="xl">
                    <Box>
                      <Box
                        flexDirection="row"
                        marginBottom="s"
                        alignItems="center"
                        justifyContent="space-between">
                        <Text variant="semibold" fontSize={16}>
                          Phone Number
                        </Text>
                        <Text variant="semibold" fontSize={16}>
                          Activate
                        </Text>
                      </Box>
                    </Box>
                    <Text color="label">
                      Add an extra layer of protection with a secure code sent
                      directly to your phone.
                    </Text>
                  </Box>
                  <Box marginBottom="mxl">
                    <Box>
                      <Box
                        flexDirection="row"
                        marginBottom="s"
                        alignItems="center"
                        justifyContent="space-between">
                        <Text variant="semibold" fontSize={16}>
                          Authentication App
                        </Text>
                        <Text variant="semibold" fontSize={16}>
                          Activate
                        </Text>
                      </Box>
                    </Box>
                    <Text color="label">
                      Add an extra layer of protection by using an
                      authentication app to generate secure codes.
                    </Text>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default SecuritySettingscreen;
