import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import { useGetFollowingMutation } from '@/state/services/users.service';
import { ErrorData, User } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import UserProfileItem from '@/components/UserProfileItem';

const UserFollowingScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'UserFollowing'>) => {
  const { user, users = [] } = route?.params;
  const [follows, setFollows] = useState<User[]>(users);
  const [getFollows, { isLoading }] = useGetFollowingMutation();
  const { foreground, foreground_primary } = useThemeColors();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 100;

  const loadFollows = useCallback(async () => {
    try {
      const response = await getFollows({
        id: user?.id,
        params: {
          limit,
          page,
        },
      });
      // console.log('follows response', JSON.stringify(response));
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
      setFollows((response as any)?.data?.data || []);
      setTotalPages((response as any)?.data?.totalPages || 1);
    } catch (error) {
      console.log('get follows error', JSON.stringify(error));
    }
  }, [getFollows, user, page]);

  useEffect(() => {
    loadFollows();
  }, [loadFollows]);

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
                  Following
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
              {isLoading && (
                <Box padding="l" alignItems="center">
                  <ActivityIndicator size="small" color={foreground_primary} />
                </Box>
              )}
              <FlatList
                data={follows}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) => <UserProfileItem user={item} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                  if (!isLoading && page < totalPages) {
                    setPage(page + 1);
                  }
                }}
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default UserFollowingScreen;
