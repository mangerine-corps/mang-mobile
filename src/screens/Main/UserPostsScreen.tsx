import { FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import { usePosts } from '@/state/hooks/posts.hook';
import PostItem from '@/components/PostItem';
import { useLoadPosts } from '@/state/hooks/loadposts.hook';

const UserPostsScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'UserPosts'>) => {
  const { foreground } = useThemeColors();
  const { userPosts = [] } = usePosts();
  const { loadUserPosts } = useLoadPosts();

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
                  Posts
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
              <FlatList
                data={route?.params?.posts || userPosts}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) => (
                  <PostItem
                    post={item}
                    profile
                    postDelete={() => {
                      loadUserPosts();
                    }}
                  />
                )}
              />

              {!route?.params?.posts && (
                <Box position="absolute" bottom={20} right={30}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CreatePost')}>
                    <Box
                      paddingHorizontal="m"
                      height={50}
                      borderRadius={100}
                      backgroundColor="primary"
                      alignItems="center"
                      flexDirection="row"
                      gap="s">
                      <MaterialCommunityIcons
                        name="plus"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text variant="bold" fontSize={12} color="white">
                        Create Post
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              )}
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default UserPostsScreen;
