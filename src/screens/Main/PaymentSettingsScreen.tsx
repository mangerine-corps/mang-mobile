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
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

const PaymentSettingscreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'PaymentSettings'>) => {
  const { foreground, foreground_primary, danger } = useThemeColors();

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
                  Payment Setting
                </Text>
              </Box>
              <Box padding="s" width={32} opacity={0}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l" paddingHorizontal="l">
                  <Box marginBottom="xl">
                    <Box
                      marginBottom="s"
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      justifyContent="space-between">
                      <Text variant="semibold" fontSize={18}>
                        Payment Method
                      </Text>
                      <TouchableOpacity>
                        <Box
                          borderWidth={1}
                          borderColor="minute_black"
                          width={40}
                          height={40}
                          justifyContent="center"
                          alignItems="center">
                          <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color={foreground_primary}
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                    <Box>
                      <TouchableOpacity>
                        <Box paddingVertical="s">
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box
                              flexDirection="row"
                              gap="s"
                              alignItems="center">
                              <Text variant="semibold" fontSize={16}>
                                Credit Card (Stripe)
                              </Text>
                              <Text>**** 1234</Text>
                            </Box>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="mid">
                              <TouchableOpacity>
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
                              <TouchableOpacity>
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
                          </Box>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <MaterialCommunityIcons
                              name="radiobox-marked"
                              size={18}
                              color={foreground_primary}
                            />
                            <Text color="label" fontSize={12}>
                              Set as default
                            </Text>
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  <Box marginBottom="xl">
                    <Box
                      marginBottom="s"
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      justifyContent="space-between">
                      <Text variant="semibold" fontSize={18}>
                        Subscription Management
                      </Text>
                    </Box>
                    <Box>
                      <TouchableOpacity>
                        <Box paddingVertical="s">
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box
                              flexDirection="row"
                              flex={1}
                              justifyContent="space-between"
                              gap="s"
                              alignItems="center">
                              <Text variant="semibold" fontSize={16}>
                                Current Plan:
                              </Text>
                              <Text fontSize={16}>Premium [$9.99/month]</Text>
                            </Box>
                          </Box>
                          <Box
                            marginTop="l"
                            flexDirection="row"
                            alignItems="center"
                            gap="s">
                            <Text variant="semibold" fontSize={16}>
                              Cancel Subscription
                            </Text>
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    </Box>
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

export default PaymentSettingscreen;
