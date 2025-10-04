import { TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import Box from './Box';
import { ErrorData, Work } from '@/utils/types';
import Text from './Text';
import { addAlpha } from '@/utils/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CocoIcon from '@/utils/custom-fonts/CocoIcon';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useDeleteWorkMutation } from '@/state/services/work.service';
import { useLoadPosts } from '@/state/hooks/loadposts.hook';
import { showMessage } from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';

interface Props {
  item: Work;
  profile?: boolean;
  postDelete?: () => void;
}

const InternalWorkItem = ({ item, profile, postDelete }: Props) => {
  const { white } = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack, any>>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteWork] = useDeleteWorkMutation();
  const { loadUserWorks } = useLoadPosts();

  const removeWork = useCallback(async () => {
    try {
      const response = await deleteWork({
        id: item.id,
      });
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
      showMessage({
        message: 'Successfully deleted item',
        type: 'success',
      });
      postDelete && postDelete();
      loadUserWorks();
    } catch (error) {
      console.log('share post error:', error);
    }
  }, [deleteWork, loadUserWorks, item.id, postDelete]);

  return (
    <Box>
      <DeleteConfirmModal
        isVisible={confirmDelete}
        closeModal={() => setConfirmDelete(false)}
        title="Oops! Want to delete this work?"
        subtitle="This work wil be deleted from your profile. Are you sure?"
        confirmDelete={() => {
          setTimeout(() => {
            removeWork();
          }, 900);
        }}
      />
      <TouchableOpacity>
        <Box
          padding="l"
          borderRadius={8}
          backgroundColor="primary_background"
          shadowColor="foreground"
          shadowOpacity={0.1}
          shadowOffset={{
            height: 4,
            width: 0,
          }}
          shadowRadius={8}
          elevation={4}>
          <Box position="relative">
            <FastImage
              resizeMode="contain"
              source={{ uri: item?.file }}
              style={{ height: 253, borderRadius: 8 }}
            />
            {profile && (
              <Box position="absolute" top={0} right={0}>
                <Box flexDirection="row" alignItems="center" gap="s">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddWork', {
                        work: item,
                      });
                    }}>
                    <Box
                      style={{ backgroundColor: addAlpha('#000000', 0.2) }}
                      justifyContent="center"
                      borderRadius={8}
                      height={48}
                      width={48}
                      alignItems="center">
                      <CocoIcon name="edit-1" size={24} color={white} />
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setConfirmDelete(true)}>
                    <Box
                      style={{ backgroundColor: addAlpha('#000000', 0.2) }}
                      justifyContent="center"
                      borderRadius={8}
                      height={48}
                      width={48}
                      alignItems="center">
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={24}
                        color={white}
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            )}
          </Box>
          <Box>
            <Text fontSize={16} lineHeight={24} variant="semibold">
              {item.title}
            </Text>
            <Text fontSize={12} lineHeight={16}>
              {item.description}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default InternalWorkItem;
