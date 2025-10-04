import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import Select from '@/components/Select';
import { useSetting } from '@/state/hooks/setting.hook';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/state/reducers/setting.reducer';
import { useUserSettings } from '@/state/hooks/usersettings.hook';
import { useLoadSettings } from '@/state/hooks/loadsettings.hook';
import { useFocusEffect } from '@react-navigation/native';
import { useGetGeneralSettingsMutation } from '@/state/services/setting.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import Button from '@/components/Button';

const GeneralSettingscreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'GeneralSettings'>) => {
  const { foreground, faded, foreground_primary } = useThemeColors();
  const { theme } = useSetting();
  const dispatch = useDispatch();
  const systemTheme = useColorScheme();
  const { general } = useUserSettings();
  const { loadGeneralSettings, generalSettingsLoading } = useLoadSettings();
  const [patchGeneral, { isLoading: patching }] =
    useGetGeneralSettingsMutation();
  const [timezone, setTimezone] = useState(general?.timeZone || '');
  const [language, setLanguage] = useState(general?.uiLanguage || 'english');
  console.log('general', general);
  const hasUpdated = useMemo(
    () => general?.uiLanguage !== language || general?.timeZone !== timezone,
    [general, timezone, language],
  );

  const patchUserSettings = useCallback(async () => {
    try {
      const body: typeof general = {
        timeZone: timezone,
        uiLanguage: language,
      };
      const response = await patchGeneral({
        patch: {
          ...body,
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
      loadGeneralSettings();
      showMessage({
        message: 'You have updated your settings',
        type: 'success',
      });
    } catch (error) {
      console.log('patch settiings error', error);
    }
  }, [loadGeneralSettings, patchGeneral, language, timezone]);

  useFocusEffect(
    useCallback(() => {
      loadGeneralSettings();
    }, [loadGeneralSettings]),
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
                  General Setting
                </Text>
              </Box>
              <Box padding="s" width={32} opacity={0}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l" paddingHorizontal="l">
                  {generalSettingsLoading && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  <Box>
                    <Box marginBottom="l">
                      <Text variant="semibold" fontSize={18}>
                        Language Preference
                      </Text>
                    </Box>
                    <Box>
                      <Select
                        borderColor={faded}
                        label="Language"
                        defaultValue={language}
                        data={[
                          {
                            title: 'English',
                            value: 'english',
                          },
                          {
                            title: 'Spanish',
                            value: 'spanish',
                          },
                          {
                            title: 'French',
                            value: 'french',
                          },
                        ]}
                        value={language}
                        onSelect={v => setLanguage(v)}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box marginBottom="l">
                      <Text variant="semibold" fontSize={18}>
                        Time Zone
                      </Text>
                    </Box>
                    <Box>
                      <Select
                        borderColor={faded}
                        label="Default Time Zone"
                        defaultValue={timezone}
                        data={[
                          {
                            title: 'PST (Pacific Standard Time)  ',
                            value: 'pst',
                          },
                          {
                            title: 'GMT (Greenwich Mean Time)',
                            value: 'gmt',
                          },
                          {
                            title: 'EST (Eastern Standard Time)',
                            value: 'est',
                          },
                        ]}
                        value={timezone}
                        onSelect={v => setTimezone(v)}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box marginBottom="l">
                      <Text variant="semibold" fontSize={18}>
                        Interface Theme
                      </Text>
                    </Box>
                    <Box
                      flexWrap="wrap"
                      flexDirection="row"
                      justifyContent="space-between"
                      gap="l">
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            setTheme({
                              theme: 'light',
                            }),
                          );
                        }}>
                        <Box>
                          <Box
                            borderWidth={theme === 'light' ? 2 : undefined}
                            overflow="hidden"
                            width={
                              (Dimensions.get('window').width - 24 * 3) / 2
                            }
                            borderRadius={6}>
                            <Image
                              source={require('@/assets/images/light.png')}
                              style={{
                                height: 186,
                                width: '100%',
                              }}
                              resizeMode="cover"
                            />
                          </Box>
                          <Text
                            marginTop="mid"
                            fontSize={16}
                            variant="semibold">
                            Light
                          </Text>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            setTheme({
                              theme: 'dark',
                            }),
                          );
                        }}>
                        <Box>
                          <Box
                            borderWidth={theme === 'dark' ? 2 : undefined}
                            overflow="hidden"
                            width={
                              (Dimensions.get('window').width - 24 * 3) / 2
                            }
                            borderRadius={6}>
                            <Image
                              source={require('@/assets/images/dark.png')}
                              style={{
                                height: 186,
                                width: '100%',
                              }}
                              resizeMode="cover"
                            />
                          </Box>
                          <Text
                            marginTop="mid"
                            fontSize={16}
                            variant="semibold">
                            Dark
                          </Text>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            setTheme({
                              theme: 'system',
                            }),
                          );
                        }}>
                        <Box>
                          <Box
                            borderWidth={theme === 'system' ? 2 : undefined}
                            overflow="hidden"
                            width={
                              (Dimensions.get('window').width - 24 * 3) / 2
                            }
                            borderRadius={6}>
                            <Image
                              source={
                                systemTheme === 'light'
                                  ? require('@/assets/images/light.png')
                                  : require('@/assets/images/dark.png')
                              }
                              style={{
                                height: 186,
                                width: '100%',
                              }}
                              resizeMode="cover"
                            />
                          </Box>
                          <Text
                            marginTop="mid"
                            fontSize={16}
                            variant="semibold">
                            System Preference
                          </Text>
                        </Box>
                      </TouchableOpacity>
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

export default GeneralSettingscreen;
