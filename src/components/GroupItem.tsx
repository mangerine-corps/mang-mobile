import { TouchableOpacity } from 'react-native';
import React from 'react';
import Box from './Box';
import Text from './Text';
import { Group, MiniGroup } from '@/utils/types';
import FastImage from 'react-native-fast-image';
import { useAuth } from '@/state/hooks/user.hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';

interface Props {
  joined?: boolean;
  item: Group | MiniGroup;
}

const GroupItem = ({ joined, item }: Props) => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  return (
    <Box>
      <TouchableOpacity>
        <Box padding="m" borderRadius={8} backgroundColor="primary_background">
          <Box flexDirection="row" gap="m">
            <Box
              width={40}
              height={40}
              overflow="hidden"
              borderRadius={6}
              backgroundColor="faded">
              <FastImage
                style={{ height: '100%', width: '100%' }}
                source={{
                  uri: item?.image,
                }}
              />
            </Box>
            <Box flex={1}>
              <Text variant="semibold" fontSize={16} numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="medium" color="label" fontSize={12}>
                {(item as Group)?.users
                  ? `${(item as Group)?.users?.length} Member${
                      (item as Group)?.users?.length > 1 ? 's' : ''
                    }`
                  : ''}
              </Text>
            </Box>
            <Box>
              {joined ||
              ((item as Group)?.users || []).find(x => x.id === user?.id) ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ViewGroup', {
                      group: item,
                    });
                  }}>
                  <Box
                    height={32}
                    borderRadius={6}
                    justifyContent="center"
                    borderWidth={1}
                    borderColor="button_primary"
                    paddingHorizontal="mid">
                    <Text
                      fontSize={12}
                      variant="semibold"
                      color="button_primary">
                      View Posts
                    </Text>
                  </Box>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('JoinGroup', {
                      group: item,
                    });
                  }}>
                  <Box
                    height={32}
                    borderRadius={6}
                    justifyContent="center"
                    borderWidth={1}
                    backgroundColor="button_primary"
                    paddingHorizontal="mid">
                    <Text fontSize={12} color="background" variant="semibold">
                      Join
                    </Text>
                  </Box>
                </TouchableOpacity>
              )}
            </Box>
          </Box>
          <Box flexDirection="row" gap="m" marginTop="s">
            <Box width={40} />
            <Box flex={1}>
              <Text numberOfLines={5}>{item.description}</Text>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default GroupItem;
