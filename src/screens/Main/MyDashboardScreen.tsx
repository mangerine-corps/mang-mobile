import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useMemo } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { addAlpha } from '@/utils/helpers';

const MyDashboardScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'Dashboard'>) => {
  const { foreground } = useThemeColors();

  const mainData = useMemo(
    () => [
      {
        title: 'Total Earnings',
        value: '$1,000,000.00',
        icon: <FontelloCocoIcon name="card" size={24} color="#1A8150" />,
        color: '#1A8150',
      },
      {
        title: 'Success Rate',
        value: '85%',
        icon: <FontelloCocoIcon name="shield" size={24} color="#7C47E7" />,
        color: '#7C47E7',
      },
      {
        title: 'Cancellation',
        value: '3',
        subvalue: '($200 loss)',
        icon: (
          <Box
            justifyContent="center"
            alignItems="center"
            borderRadius={12}
            height={36}
            width={36}
            style={{
              backgroundColor: '#FFC107',
              transform: [
                {
                  scale: 24 / 36,
                },
              ],
            }}>
            <MaterialCommunityIcons name="exclamation" color="#FFF" size={24} />
          </Box>
        ),
        color: '#FFC107',
      },
      {
        title: 'Returning Client’s Rate',
        value: '60%',
        icon: (
          <MaterialCommunityIcons name="account" size={24} color="#9287A0" />
        ),
        color: '#9287A0',
      },
    ],
    [],
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
                  My Dashboard
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box>
                    <Text marginBottom="m" variant="semibold" fontSize={16}>
                      Activiy Overview
                    </Text>
                    <Box
                      flexDirection="row"
                      flexWrap="wrap"
                      gap="l"
                      justifyContent="space-between"
                      alignItems="stretch">
                      {mainData.map(d => (
                        <Box
                          key={d.title}
                          height={60}
                          borderRadius={6}
                          shadowColor="foreground"
                          backgroundColor="primary_background"
                          shadowOffset={{
                            height: 0,
                            width: 0,
                          }}
                          shadowOpacity={0.1}
                          shadowRadius={4}
                          elevation={4}
                          padding="s"
                          alignItems="stretch"
                          width={(Dimensions.get('window').width - 24 * 3) / 2}
                          flexDirection="row"
                          gap="s">
                          <Box flex={1} justifyContent="space-between">
                            <Text fontSize={10} color="label">
                              {d.title}
                            </Text>
                            <Text
                              variant="semibold"
                              fontSize={16}
                              numberOfLines={1}>
                              {d.value}
                              {d?.subvalue && (
                                <Text fontSize={14}>{d?.subvalue}</Text>
                              )}
                            </Text>
                          </Box>
                          <Box justifyContent="center">
                            <Box
                              width={44}
                              height={44}
                              borderRadius={6}
                              justifyContent="center"
                              alignItems="center"
                              style={{
                                backgroundColor: addAlpha(d?.color, 0.1),
                              }}>
                              {d.icon}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box marginBottom="l">
                      <Text fontSize={10} color="label">
                        Statistics
                      </Text>
                      <Text fontSize={12} variant="semibold">
                        Consultation Overview
                      </Text>
                    </Box>
                    <Box height={200} backgroundColor="faded"></Box>
                  </Box>
                  <Box marginTop="l">
                    <Box marginBottom="l">
                      <Text fontSize={10} color="label">
                        Scheduled Consultation
                      </Text>
                      <Text fontSize={12} variant="semibold">
                        100
                      </Text>
                    </Box>
                    <Box height={200} backgroundColor="faded"></Box>
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

export default MyDashboardScreen;
