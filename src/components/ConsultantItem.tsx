import { TouchableOpacity } from 'react-native';
import React from 'react';
import Box from './Box';
import { Consultant } from '@/utils/types';
import FastImage from 'react-native-fast-image';
import Text from './Text';
import { useThemeColors } from '@/hooks/useTheme';
import CocoIcon from '@/utils/custom-fonts/CocoIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useAuth } from '@/state/hooks/user.hook';

interface Props {
  consultant: Consultant;
}

const ConsultantItem = ({ consultant }: Props) => {
  const { label } = useThemeColors();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  return (
    <Box>
      <TouchableOpacity
        onPress={() => {
          if (consultant?.id === user?.id) {
            navigation.navigate('Tabs', {
              screen: 'Profile',
            });
          } else {
            navigation.navigate('ViewProfile', {
              user: consultant,
            });
          }
        }}>
        <Box>
          <Box
            height={201}
            overflow="hidden"
            backgroundColor="black"
            borderRadius={8}>
            <FastImage
              style={{ height: '100%', width: '100%' }}
              source={{
                uri: consultant?.profilePics || '',
              }}
            />
          </Box>
          <Box marginTop="s">
            <Box flexDirection="row" gap="l" alignItems="flex-start">
              <Box flex={1} gap="xs">
                <Text numberOfLines={1} variant="semibold" fontSize={20}>
                  {consultant.fullName}
                </Text>
                <Text numberOfLines={1} color="label">
                  {consultant?.title}
                </Text>
              </Box>
              <Box>
                <Text numberOfLines={1} color="label">
                  {(consultant?.languages || [])
                    .map(l => l.language)
                    .join(', ')}
                </Text>
              </Box>
            </Box>
            <Box
              flexDirection="row"
              alignItems="flex-end"
              marginTop="s"
              gap="m">
              <Box flex={1}>
                <Box>
                  <Text numberOfLines={2}>{consultant?.bio}</Text>
                </Box>

                <Box flexDirection="row" alignItems="center" marginTop="s">
                  <CocoIcon name="location" size={16} color={label} />
                  <Text fontSize={12} color="label">
                    {consultant?.location}
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
                    <CocoIcon name="heart" size={24} color="#E8BC8B" />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default ConsultantItem;
