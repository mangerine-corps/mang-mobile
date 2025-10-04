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

const HelpAndSupportcreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'HelpAndSupport'>) => {
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
                  Help & Support
                </Text>
              </Box>
              <Box padding="s" width={32} opacity={0}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l" paddingHorizontal="l" gap="m">
                  <TouchableOpacity>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      justifyContent="space-between">
                      <Text>Frequently asked questions</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={foreground}
                      />
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      justifyContent="space-between">
                      <Text>Feedback</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={foreground}
                      />
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="l"
                      justifyContent="space-between">
                      <Text>Customer Support</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={foreground}
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default HelpAndSupportcreen;
