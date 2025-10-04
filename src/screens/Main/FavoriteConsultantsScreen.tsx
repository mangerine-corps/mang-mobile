import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

const FavouriteConsultantsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'FavouriteConsultants'>) => {
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
                  Favorite Consultants
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingHorizontal="l" gap="m" paddingVertical="m">
                  <Box flexDirection="row" alignItems="center" gap="l">
                    <Box
                      flex={1}
                      flexDirection="row"
                      gap="s"
                      alignItems="stretch">
                      <Box
                        height={48}
                        width={48}
                        borderRadius={48}
                        overflow="hidden"
                        backgroundColor="faded"></Box>
                      <Box justifyContent="space-between">
                        <Text
                          variant="semibold"
                          fontSize={16}
                          numberOfLines={1}>
                          Marvin McKinney
                        </Text>
                        <Text variant="medium" numberOfLines={1} color="label">
                          Painter
                        </Text>
                      </Box>
                    </Box>
                    <Box>
                      <TouchableOpacity>
                        <Box
                          height={40}
                          width={40}
                          borderWidth={2}
                          borderRadius={40}
                          borderColor="faded_border"
                          justifyContent="center"
                          alignItems="center">
                          <FontelloCocoIcon
                            name="heart"
                            size={24}
                            color="#E8BC8B"
                          />
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

export default FavouriteConsultantsScreen;
