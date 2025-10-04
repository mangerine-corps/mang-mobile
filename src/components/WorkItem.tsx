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
import { Menu, MenuItem } from 'react-native-material-menu';
import CocoIcon from '@/utils/custom-fonts/CocoIcon';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useDeleteWorkMutation } from '@/state/services/work.service';
import { useLoadPosts } from '@/state/hooks/loadposts.hook';
import { showMessage } from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';

interface Props {
  work: Work;
  profile?: boolean;
  postDelete?: () => void;
}

const WorkItem = ({ work, profile, postDelete }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { foreground, danger, background } = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack, any>>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteWork] = useDeleteWorkMutation();
  const { loadUserWorks } = useLoadPosts();

  const removeWork = useCallback(async () => {
    try {
      const response = await deleteWork({
        id: work.id,
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
  }, [deleteWork, loadUserWorks, work.id, postDelete]);

  return (
    <Box>
      <DeleteConfirmModal
        isVisible={confirmDelete}
        closeModal={() => setConfirmDelete(false)}
        title="Oops! Want to delete this work?"
        subtitle="This work wil be deleted from your profile. Are you sure?"
        confirmDelete={() => {
          setMenuVisible(false);
          setTimeout(() => {
            removeWork();
          }, 900);
        }}
      />
      <TouchableOpacity>
        <Box
          height={250}
          width={200}
          borderRadius={8}
          backgroundColor="background"
          shadowColor="foreground"
          elevation={4}
          shadowOpacity={0.1}
          shadowRadius={4}
          shadowOffset={{
            height: 4,
            width: 0,
          }}>
          <Box paddingHorizontal="mid" paddingTop="mid">
            <Box position="relative">
              <FastImage
                resizeMode="cover"
                source={{ uri: work?.file }}
                style={{ height: 148, borderRadius: 8 }}
              />
              {profile && (
                <Box position="absolute" top={0} left={0}>
                  <Box>
                    <Menu
                      style={{
                        backgroundColor: background,
                      }}
                      visible={menuVisible}
                      anchor={
                        <TouchableOpacity onPress={() => setMenuVisible(true)}>
                          <Box
                            style={{
                              backgroundColor: addAlpha('#000000', 0.2),
                            }}
                            justifyContent="center"
                            borderRadius={8}
                            alignItems="center">
                            <MaterialCommunityIcons
                              name="dots-vertical"
                              size={24}
                              color="#FFFFFF"
                            />
                          </Box>
                        </TouchableOpacity>
                      }
                      onRequestClose={() => setMenuVisible(false)}>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                          setTimeout(() => {
                            navigation.navigate('AddWork', {
                              work,
                            });
                          }, 900);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <CocoIcon
                            name="edit-1"
                            size={18}
                            color={foreground}
                          />
                          <Text>Edit Work</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onPress={() => {
                          setMenuVisible(false);
                          setTimeout(() => {
                            // deleteRef.current?.show();
                            setConfirmDelete(true);
                          }, 900);
                        }}>
                        <Box flexDirection="row" alignItems="center" gap="s">
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color={danger}
                          />
                          <Text>Delete Work</Text>
                        </Box>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box gap="s" paddingTop="s" paddingHorizontal="mid">
            <Text fontSize={16} variant="semibold" numberOfLines={1}>
              {work?.title}
            </Text>
            <Text numberOfLines={3} fontSize={12}>
              {work?.description}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default WorkItem;
