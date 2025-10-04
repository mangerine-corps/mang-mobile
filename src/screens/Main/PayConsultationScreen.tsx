import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb.',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  dayNamesShort: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
  today: 'Today',
};

LocaleConfig.defaultLocale = 'en';

const PayConsultationScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'PayConsultation'>) => {
  const { foreground } = useThemeColors();

  return (
    <BaseScreenComponent>
      <Box flex={1}>
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
                  onPress={navigation.goBack}
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
                  Payment
                </Text>
              </Box>
              <Box padding="s" opacity={0}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={foreground}
                />
              </Box>
            </Box>
            <Box flex={1} position="relative">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l">
                  <Box
                    marginHorizontal="l"
                    backgroundColor="primary_background"
                    padding="m">
                    <Box>
                      <Text variant="semibold" fontSize={18}>
                        Payment Information
                      </Text>
                    </Box>
                    <Box gap="s" marginTop="m">
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium">Consultation Fee</Text>
                        </Box>
                        <Box>
                          <Text>$50.00</Text>
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium">Mangerine Fee</Text>
                        </Box>
                        <Box>
                          <Text>$10.00</Text>
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium">Recording Fee</Text>
                        </Box>
                        <Box>
                          <Text>$5.00</Text>
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row"
                        gap="l"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box flex={1}>
                          <Text variant="medium" fontSize={16}>
                            Total Fee
                          </Text>
                        </Box>
                        <Box>
                          <Text variant="medium" fontSize={16}>
                            $65.00
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginHorizontal="l" marginTop="xxl" marginBottom="xl">
                    <Button displayText="Confirm Payment" />
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

export default PayConsultationScreen;
