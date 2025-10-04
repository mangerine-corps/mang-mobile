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
import { useLoadPosts } from '@/state/hooks/loadposts.hook';
import InternalWorkItem from '@/components/InternalWorkItem';

const UserWorksScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'UserWorks'>) => {
  const { foreground } = useThemeColors();
  const { userWorks = [] } = usePosts();
  const { loadUserWorks } = useLoadPosts();

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
                  Works
                </Text>
              </Box>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddWork');
                }}>
                <Box padding="s">
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={foreground}
                  />
                </Box>
              </TouchableOpacity>
            </Box>
            <Box flex={1} position="relative">
              <FlatList
                data={route?.params?.works || userWorks}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) => (
                  <InternalWorkItem
                    item={item}
                    profile={!route.params?.works}
                    postDelete={() => {
                      loadUserWorks();
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default UserWorksScreen;
