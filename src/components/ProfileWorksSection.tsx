import { ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Box from './Box';
import Text from './Text';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmptyState from './EmptyState';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { usePosts } from '@/state/hooks/posts.hook';
import WorkItem from './WorkItem';
import { Work } from '@/utils/types';

interface Props {
  works?: Work[];
  name?: string;
}

const ProfileWorksSection = ({ works, name }: Props) => {
  const { foreground } = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const { userWorks = [] } = usePosts();

  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box>
          <Text fontSize={16} variant="bold">
            {works
              ? `${
                  name
                    ? name.split(' ')[0][name.length - 1] === 's'
                      ? `${name.split(' ')[0]}' `
                      : `${name.split(' ')[0]}'s `
                    : ''
                }Works`
              : 'My Works'}
          </Text>
        </Box>
        {(works || userWorks)?.length > 0 ? (
          <Box>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserWorks');
              }}>
              <Text variant="bold" color="primary">
                See all
              </Text>
            </TouchableOpacity>
          </Box>
        ) : !works ? (
          <Box>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddWork');
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={foreground}
              />
            </TouchableOpacity>
          </Box>
        ) : null}
      </Box>
      <Box>
        {(works || userWorks)?.length > 0 ? (
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <Box
              flexDirection="row"
              alignItems="flex-start"
              gap="m"
              paddingVertical="m">
              {(works || userWorks).map(w => (
                <WorkItem work={w} key={w.id} profile={!works} />
              ))}
            </Box>
          </ScrollView>
        ) : (
          <EmptyState
            subtitle="No works added yet"
            buttonText={!works ? 'Add work' : undefined}
            doSomething={
              !works
                ? () => {
                    navigation.navigate('AddWork');
                  }
                : undefined
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfileWorksSection;
