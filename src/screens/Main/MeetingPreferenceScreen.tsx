import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import Select from '@/components/Select';
import Button from '@/components/Button';

const MeetingPreferenceScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'MeetingPreference'>) => {
  const { foreground, faded } = useThemeColors();
  const [advance, setAdvance] = useState('');
  const [buffer, setBuffer] = useState('');
  const [limit, setLimit] = useState(1);

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
                  Meeting Preference
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box marginBottom="l" paddingHorizontal="xl">
                    <Text textAlign="center" color="label">
                      Please update your meeting preference for consultation
                    </Text>
                  </Box>
                  <Box>
                    <Box>
                      <Text variant="medium" fontSize={16}>
                        Advance Notice
                      </Text>
                      <Text color="label" marginTop="s" marginBottom="m">
                        How much notice do you want before meeting
                      </Text>
                      <Box>
                        <Select
                          borderColor={faded}
                          // label="Default Time Zone"
                          defaultValue={advance}
                          data={[
                            {
                              title: '6 Hours',
                              value: '6 Hours',
                            },
                            {
                              title: '12 Hours',
                              value: '12 Hours',
                            },
                            {
                              title: '24 Hours',
                              value: '24 Hours',
                            },
                          ]}
                          value={advance}
                          onSelect={v => setAdvance(v)}
                          title="Select advance notice hour"
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="medium" fontSize={16}>
                        Meeting Buffer
                      </Text>
                      <Text color="label" marginTop="s" marginBottom="m">
                        Set time between meetings
                      </Text>
                      <Box>
                        <Select
                          borderColor={faded}
                          // label="Default Time Zone"
                          defaultValue={buffer}
                          data={[
                            {
                              title: '30 Minutes',
                              value: '30 Minutes',
                            },
                            {
                              title: '1 Hour',
                              value: '1 Hour',
                            },
                            {
                              title: '2 Hours',
                              value: '2 Hours',
                            },
                          ]}
                          value={buffer}
                          onSelect={v => setBuffer(v)}
                          title="Select meeting buffer time"
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="medium" fontSize={16}>
                        Daily Limit
                      </Text>
                      <Text color="label" marginTop="s" marginBottom="m">
                        How many meetings can you take in a day?
                      </Text>
                      <Box flexDirection="row" alignItems="center" gap="m">
                        <TouchableOpacity
                          disabled={limit <= 1}
                          onPress={() => setLimit(limit - 1)}>
                          <Box
                            width={44}
                            height={44}
                            shadowColor="foreground"
                            shadowOffset={{
                              height: 0,
                              width: 0,
                            }}
                            shadowOpacity={0.1}
                            shadowRadius={4}
                            elevation={4}
                            backgroundColor="primary_background"
                            justifyContent="center"
                            alignItems="center">
                            <Text fontSize={24}>-</Text>
                          </Box>
                        </TouchableOpacity>
                        <Box>
                          <Text>{limit}</Text>
                        </Box>
                        <TouchableOpacity onPress={() => setLimit(limit + 1)}>
                          <Box
                            width={44}
                            height={44}
                            shadowColor="foreground"
                            shadowOffset={{
                              height: 0,
                              width: 0,
                            }}
                            shadowOpacity={0.1}
                            shadowRadius={4}
                            elevation={4}
                            backgroundColor="primary_background"
                            justifyContent="center"
                            alignItems="center">
                            <Text fontSize={24}>+</Text>
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
            <Box gap="l" paddingHorizontal="l" paddingTop="l">
              <Box>
                <Button displayText="Save" />
              </Box>
              <Box>
                <Button
                  buttonProps={{
                    backgroundColor: 'background',
                    borderWidth: 1,
                    borderColor: 'button_primary',
                  }}
                  textProps={{
                    color: 'button_primary',
                  }}
                  displayText="Cancel"
                  onPress={navigation.goBack}
                />
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default MeetingPreferenceScreen;
