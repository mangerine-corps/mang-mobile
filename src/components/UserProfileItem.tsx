import { TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import Box from './Box';
import { User } from '@/utils/types';
import FastImage from 'react-native-fast-image';
import Text from './Text';
import Button from './Button';
import { useAuth } from '@/state/hooks/user.hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';

interface Props {
  user: User;
}

const UserProfileItem = ({ user }: Props) => {
  const { followers = [], follows = [], user: authUser } = useAuth();
  const following = useMemo(
    () => follows?.find(x => x?.id === user?.id) !== undefined,
    [user, follows],
  );
  const followsYou = useMemo(
    () => followers?.find(x => x?.id === user?.id) !== undefined,
    [user, followers],
  );
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  return (
    <Box>
      <Box flexDirection="row" gap="s" alignItems="flex-start">
        <TouchableOpacity
          onPress={() => {
            if (authUser?.id === user?.id) {
              navigation?.navigate('Tabs', {
                screen: 'Profile',
              });
              return;
            }
            navigation?.navigate('ViewProfile', {
              user: user,
            });
          }}>
          <Box
            height={40}
            width={40}
            borderRadius={40}
            backgroundColor="primary"
            overflow="hidden"
            justifyContent="center"
            alignItems="center">
            {user?.profilePics ? (
              <FastImage
                style={{ width: 40, height: 40, borderRadius: 40 }}
                source={{
                  uri: user?.profilePics,
                }}
              />
            ) : (
              <Text fontSize={24} variant="bold" color="white">
                {user?.fullName[0]}
              </Text>
            )}
          </Box>
        </TouchableOpacity>
        <Box flex={1} flexDirection="row" gap="m">
          <Box flex={1} maxWidth="75%">
            <Box>
              <Text variant="semibold" fontSize={20}>
                {user?.fullName}
              </Text>
            </Box>
            <Box>
              <Text variant="semibold" fontSize={16} color="label">
                {user?.title || user?.businessName}
              </Text>
            </Box>
          </Box>
          <Box width={113}>
            {authUser?.id !== user?.id && (
              <Button
                displayText={
                  followsYou && !following
                    ? 'Follow Back'
                    : !following
                    ? 'Follow'
                    : 'Unfollow'
                }
                buttonProps={{
                  height: 48,
                  minWidth: 113,
                  borderWidth: 1.5,
                  borderColor: 'primary',
                  backgroundColor: following ? 'background' : 'primary',
                }}
                textProps={{
                  color: following ? 'button_primary' : 'background',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box flexDirection="row" gap="s" marginTop="s">
        <Box width={40} />
        <Box flex={1}>
          <Box width="100%">
            <Text fontSize={16} numberOfLines={4}>
              {user?.bio}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileItem;
