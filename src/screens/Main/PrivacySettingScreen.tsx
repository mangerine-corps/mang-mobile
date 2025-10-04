import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import Switch from '@/components/Switch';
import { useUserSettings } from '@/state/hooks/usersettings.hook';
import { useLoadSettings } from '@/state/hooks/loadsettings.hook';
import Button from '@/components/Button';
import { useGetCurrentSettingsMutation } from '@/state/services/setting.service';
import { showMessage } from 'react-native-flash-message';
import { ErrorData } from '@/utils/types';
import { useFocusEffect } from '@react-navigation/native';

const PrivacySettingscreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'PrivacySettings'>) => {
  const { foreground, foreground_primary, label } = useThemeColors();
  const { privacy } = useUserSettings();
  const [messaging, setMessaging] = useState(
    privacy?.messagingPreference || '',
  );
  const [search, setSearch] = useState(privacy?.appearInSearchResults || false);
  const { loadPrivacy, privacyLoading } = useLoadSettings();
  const [patchPrivacy, { isLoading: patching }] =
    useGetCurrentSettingsMutation();

  const hasUpdated = useMemo(
    () => privacy?.messagingPreference !== messaging,
    [privacy, messaging],
  );

  const patchUserSettings = useCallback(async () => {
    try {
      const response = await patchPrivacy({
        patch: {
          appearInSearchResults: search,
          messagingPreference: messaging,
        },
      });
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
      loadPrivacy();
      showMessage({
        message: 'You have updated your privacy settings',
        type: 'success',
      });
    } catch (error) {
      console.log('patch settiings error', error);
    }
  }, [loadPrivacy, patchPrivacy, messaging, search]);

  useFocusEffect(
    useCallback(() => {
      loadPrivacy();
    }, [loadPrivacy]),
  );

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
                  Privacy Setting
                </Text>
              </Box>
              <Box padding="s" width={32} opacity={0}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {privacyLoading && (
                  <Box alignItems="center" padding="l">
                    <ActivityIndicator
                      size="small"
                      color={foreground_primary}
                    />
                  </Box>
                )}
                <Box paddingVertical="l" paddingHorizontal="l">
                  <Box marginBottom="l">
                    <Text variant="semibold" fontSize={18} marginBottom="m">
                      Messaging
                    </Text>
                    <Text fontSize={16} marginBottom="mid">
                      Who can message me?
                    </Text>
                    <Box gap="m">
                      <TouchableOpacity
                        onPress={() => setMessaging('everyone')}>
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Box>
                            <Text>Everyone</Text>
                          </Box>
                          <Box>
                            <MaterialCommunityIcons
                              name={
                                messaging === 'everyone'
                                  ? 'radiobox-marked'
                                  : 'radiobox-blank'
                              }
                              size={16}
                              color={
                                messaging === 'everyone'
                                  ? foreground_primary
                                  : label
                              }
                            />
                          </Box>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setMessaging('followers')}>
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Box>
                            <Text>Followers</Text>
                          </Box>
                          <Box>
                            <MaterialCommunityIcons
                              name={
                                messaging === 'followers'
                                  ? 'radiobox-marked'
                                  : 'radiobox-blank'
                              }
                              size={16}
                              color={
                                messaging === 'followers'
                                  ? foreground_primary
                                  : label
                              }
                            />
                          </Box>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setMessaging('communityMembers')}>
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Box>
                            <Text>Community Members</Text>
                          </Box>
                          <Box>
                            <MaterialCommunityIcons
                              name={
                                messaging === 'community'
                                  ? 'radiobox-marked'
                                  : 'radiobox-blank'
                              }
                              size={16}
                              color={
                                messaging === 'community'
                                  ? foreground_primary
                                  : label
                              }
                            />
                          </Box>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setMessaging('noOne')}>
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center">
                          <Box>
                            <Text>No One</Text>
                          </Box>
                          <Box>
                            <MaterialCommunityIcons
                              name={
                                messaging === 'noone'
                                  ? 'radiobox-marked'
                                  : 'radiobox-blank'
                              }
                              size={16}
                              color={
                                messaging === 'noone'
                                  ? foreground_primary
                                  : label
                              }
                            />
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  {/* <Box marginBottom="l">
                    <Text variant="semibold" fontSize={18} marginBottom="m">
                      Profile Visibility
                    </Text>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box>
                        <Text>Show online status</Text>
                      </Box>
                      <Box>
                        <Switch
                          value={onlineStatus}
                          onPress={() => setOnlineStatus(!onlineStatus)}
                        />
                      </Box>
                    </Box>
                  </Box> */}
                  <Box marginBottom="l">
                    <Text variant="semibold" fontSize={18} marginBottom="m">
                      Profile Visibility
                    </Text>
                    <Box gap="mid">
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box>
                          <Text>Appear in search results</Text>
                        </Box>
                        <Box>
                          <Switch
                            value={search}
                            onPress={() => setSearch(!search)}
                          />
                        </Box>
                      </Box>
                      {/* <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box>
                          <Text>
                            Allow search engines to link to my profile
                          </Text>
                        </Box>
                        <Box>
                          <Switch
                            value={engines}
                            onPress={() => setEngines(!engines)}
                          />
                        </Box>
                      </Box> */}
                    </Box>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
            <Box paddingBottom="xl" paddingHorizontal="l">
              <Button
                disabled={!hasUpdated}
                loading={patching}
                displayText="Save Changes"
                onPress={() => {
                  patchUserSettings();
                }}
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default PrivacySettingscreen;
