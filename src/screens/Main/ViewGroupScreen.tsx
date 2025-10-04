import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OctIcon from 'react-native-vector-icons/Octicons';
import Text from '@/components/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import {
  useDeleteCommunityMutation,
  useGetCommunityMutation,
  useGetCommunityPostsMutation,
  useJoinLeaveCommunityMutation,
} from '@/state/services/community.service';
import { ErrorData, Group, Post } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { Menu, MenuItem } from 'react-native-material-menu';
import FontelloCocoIconOutline from '@/utils/custom-fonts/FontelloCocoIconOutline';
import { orderBy } from 'lodash';
import EmptyState from '@/components/EmptyState';
import PostItem from '@/components/PostItem';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/state/hooks/user.hook';
import ConfirmModal from '@/components/ConfirmModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Button from '@/components/Button';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

const ViewGroupScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'ViewGroup'>) => {
  const { foreground, label, background, foreground_primary } =
    useThemeColors();
  const { user } = useAuth();
  const [getGroup, { isLoading }] = useGetCommunityMutation();
  const [preview, setPreview] = useState(false);
  const { group } = route?.params;
  const [loadedGroup, setLoadedGroup] = useState<Group>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [getPosts, { isLoading: postsLoading }] =
    useGetCommunityPostsMutation();
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const limit = 100;
  const isGroupOwner = loadedGroup?.creator?.id === user?.id;
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveGroup, { isLoading: leaveLoading }] =
    useJoinLeaveCommunityMutation();
  const [deleteGroup, { isLoading: deleteLoading }] =
    useDeleteCommunityMutation();

  const orderedPosts = useMemo(
    () => orderBy(posts, ['createdAt'], 'desc'),
    [posts],
  );

  const load = useCallback(async () => {
    try {
      const response = await getGroup({
        id: group?.id,
      });
      // console.log('response', JSON.stringify(response));
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
      setLoadedGroup((response as any)?.data?.data);
    } catch (error) {
      console.log('group error:', error);
    }
  }, [getGroup, group?.id]);

  const loadPosts = useCallback(async () => {
    try {
      const response = await getPosts({
        params: {
          groupId: group?.id,
          limit,
          page,
        },
      });
      // console.log('loadPosts-response', JSON.stringify(response));
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
      setPosts((response as any)?.data?.data?.posts || []);
      setHasNextPage((response as any)?.data?.data?.hasNextPage || false);
    } catch (error) {
      console.log('group error:', error);
    }
  }, [getPosts, group?.id, page]);

  const leaveThisGroup = useCallback(async () => {
    try {
      const response = await leaveGroup({
        id: group?.id,
      });
      // console.log('loadPosts-response', JSON.stringify(response));
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
      navigation?.goBack();
    } catch (error) {
      console.log('group error:', error);
    }
  }, [leaveGroup, group?.id, navigation]);

  const deleteThisGroup = useCallback(async () => {
    try {
      const response = await deleteGroup({
        id: group?.id,
      });
      // console.log('loadPosts-response', JSON.stringify(response));
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
      navigation?.goBack();
    } catch (error) {
      console.log('group error:', error);
    }
  }, [deleteGroup, group?.id, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [load]),
  );

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [loadPosts]),
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <ConfirmModal
              closeModal={() => setLeaveConfirm(false)}
              isVisible={leaveConfirm}
              title={`Are you sure you want to leave ${group?.name}?`}
              subtitle="Once you leave, you won’t be able to participate in discussions, view posts, or receive updates from this group."
              confirmButton="Yes, leave"
              confirm={() => {
                setLeaveConfirm(false);
                setTimeout(() => {
                  leaveThisGroup();
                }, 900);
              }}
            />
            <DeleteConfirmModal
              closeModal={() => setDeleteConfirm(false)}
              isVisible={deleteConfirm}
              title={`Are you sure you want to delete ${group?.name}?`}
              subtitle="This will delete the group and remove all members. You won’t be able to undo this action."
              confirmDelete={() => {
                setDeleteConfirm(false);
                setTimeout(() => {
                  deleteThisGroup();
                }, 900);
              }}
            />
            <KeyboardAvoidingView
              keyboardVerticalOffset={15}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
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
                        if (preview) {
                          setPreview(false);
                          return;
                        }
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
                      {group?.name}
                    </Text>
                  </Box>
                  <Box padding="s" width={32} opacity={0}></Box>
                </Box>
                <Box flex={1} position="relative">
                  {postsLoading && orderedPosts.length < 1 && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  {(leaveLoading || deleteLoading) && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  <Box flex={1} onStartShouldSetResponder={() => true}>
                    <FlatList
                      onEndReachedThreshold={0.3}
                      onEndReached={() => {
                        if (!postsLoading && hasNextPage) {
                          setPage(page + 1);
                        }
                      }}
                      refreshing={postsLoading}
                      refreshControl={
                        <RefreshControl
                          refreshing={postsLoading}
                          onRefresh={() => {
                            if (page === 1) {
                              loadPosts();
                            } else {
                              setPage(1);
                            }
                          }}
                        />
                      }
                      data={orderedPosts}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        gap: 16,
                        paddingBottom: 60,
                      }}
                      ListEmptyComponent={
                        <Box>
                          <EmptyState
                            subtitle="No posts here yet"
                            buttonText="Create Post"
                            doSomething={() =>
                              navigation.navigate('CreatePost', {
                                groupId: group?.id,
                              })
                            }
                          />
                        </Box>
                      }
                      ListHeaderComponent={
                        <Box
                          onStartShouldSetResponder={() => true}
                          paddingVertical="l"
                          paddingHorizontal="l">
                          {isLoading && (
                            <Box padding="l" alignItems="center">
                              <ActivityIndicator
                                size="small"
                                color={foreground_primary}
                              />
                            </Box>
                          )}
                          <Box
                            height={106}
                            marginBottom="m"
                            borderTopRightRadius={12}
                            borderTopLeftRadius={12}
                            overflow="hidden">
                            <FastImage
                              style={{ height: '100%', width: '100%' }}
                              source={{ uri: (loadedGroup || group)?.image }}
                            />
                          </Box>
                          <Box>
                            <Box marginBottom="s">
                              <Box flexDirection="row" gap="l">
                                <Box flex={1}>
                                  <Text variant="semibold" fontSize={16}>
                                    {(loadedGroup || group)?.name}
                                  </Text>
                                  <Text fontSize={16}>{group?.category}</Text>
                                </Box>
                                {isGroupOwner && (
                                  <Box minWidth={95}>
                                    <Button
                                      onPress={() => {
                                        navigation.navigate('CreateGroup', {
                                          group,
                                        });
                                      }}
                                      buttonProps={{
                                        height: 40,
                                      }}
                                      displayText="Edit">
                                      <FontelloCocoIcon
                                        name="edit-1"
                                        size={24}
                                        color="#FFFFFF"
                                      />
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                              <Text marginTop="s">{group?.description}</Text>
                            </Box>
                          </Box>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <Box
                              flexDirection="row"
                              gap="s"
                              alignItems="center">
                              <Box flexDirection="row" alignItems="center">
                                {(loadedGroup?.users || []).map((x, index) => (
                                  <Box
                                    key={x.profilePics}
                                    height={24}
                                    overflow="hidden"
                                    width={24}
                                    style={{ marginLeft: index > 0 ? -12 : 0 }}
                                    borderWidth={1.5}
                                    borderRadius={24}
                                    backgroundColor="faded"
                                    borderColor="primary_background">
                                    <FastImage
                                      source={{ uri: x?.profilePics || '' }}
                                      style={{ height: '100%', width: '100%' }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                              <Text variant="semibold">
                                {loadedGroup?.users?.length}{' '}
                                <Text variant="medium" color="label">
                                  Members ||{' '}
                                </Text>
                              </Text>
                              <Feather name="globe" size={24} color={label} />
                              <Text
                                variant="medium"
                                fontSize={16}
                                color="label"
                                textTransform="capitalize">
                                {group?.isPrivate ? 'Private' : 'Public'}
                              </Text>
                            </Box>
                            <Box
                              flexDirection="row"
                              gap="s"
                              style={{ marginLeft: 'auto' }}>
                              <TouchableOpacity>
                                <Box
                                  height={44}
                                  width={44}
                                  borderWidth={1}
                                  borderColor="faded_border"
                                  borderRadius={8}
                                  justifyContent="center"
                                  alignItems="center">
                                  <MaterialCommunityIcons
                                    name="bell"
                                    size={24}
                                    color={label}
                                  />
                                </Box>
                              </TouchableOpacity>
                              <Menu
                                style={{
                                  backgroundColor: background,
                                }}
                                visible={menuVisible}
                                anchor={
                                  <TouchableOpacity
                                    onPress={() => setMenuVisible(true)}>
                                    <Box
                                      height={44}
                                      width={44}
                                      borderWidth={1}
                                      borderColor="faded_border"
                                      borderRadius={8}
                                      justifyContent="center"
                                      alignItems="center">
                                      <MaterialCommunityIcons
                                        name="dots-vertical"
                                        size={24}
                                        color={label}
                                      />
                                    </Box>
                                  </TouchableOpacity>
                                }
                                onRequestClose={() => setMenuVisible(false)}>
                                <MenuItem
                                  onPress={() => {
                                    setMenuVisible(false);
                                  }}>
                                  <Box
                                    flexDirection="row"
                                    alignItems="center"
                                    gap="s">
                                    <FontelloCocoIconOutline
                                      name="user-plus"
                                      size={18}
                                      color={foreground}
                                    />
                                    <Text>Invite Friend</Text>
                                  </Box>
                                </MenuItem>
                                {isGroupOwner && (
                                  <MenuItem
                                    onPress={() => {
                                      setMenuVisible(false);
                                    }}>
                                    <Box
                                      flexDirection="row"
                                      alignItems="center"
                                      gap="s">
                                      <FontelloCocoIconOutline
                                        name="message-3"
                                        size={18}
                                        color={foreground}
                                      />
                                      <Text>Manage your content</Text>
                                    </Box>
                                  </MenuItem>
                                )}
                                <MenuItem
                                  onPress={() => {
                                    setMenuVisible(false);
                                    // setTimeout(() => {
                                    //   setConfirmBlock(true);
                                    // }, 900);
                                  }}>
                                  <Box
                                    flexDirection="row"
                                    alignItems="center"
                                    gap="s">
                                    <OctIcon
                                      name="pin"
                                      size={18}
                                      color={foreground}
                                    />
                                    <Text>Pin Group</Text>
                                  </Box>
                                </MenuItem>
                                {!isGroupOwner && (
                                  <MenuItem
                                    onPress={() => {
                                      setMenuVisible(false);
                                      // setTimeout(() => {
                                      //   setReportUser(true);
                                      // }, 900);
                                    }}>
                                    <Box
                                      flexDirection="row"
                                      alignItems="center"
                                      gap="s">
                                      <MaterialCommunityIcons
                                        name="flag-outline"
                                        size={18}
                                        color={foreground}
                                      />
                                      <Text>Report Group</Text>
                                    </Box>
                                  </MenuItem>
                                )}
                                {isGroupOwner ? (
                                  <MenuItem
                                    onPress={() => {
                                      setMenuVisible(false);
                                      setTimeout(() => {
                                        setDeleteConfirm(true);
                                      }, 900);
                                    }}>
                                    <Box
                                      flexDirection="row"
                                      alignItems="center"
                                      gap="s">
                                      <MaterialCommunityIcons
                                        name="trash-can"
                                        size={18}
                                        color={foreground}
                                      />
                                      <Text>Delete Group</Text>
                                    </Box>
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    onPress={() => {
                                      setMenuVisible(false);
                                      setTimeout(() => {
                                        setLeaveConfirm(true);
                                      }, 900);
                                    }}>
                                    <Box
                                      flexDirection="row"
                                      alignItems="center"
                                      gap="s">
                                      <MaterialCommunityIcons
                                        name="logout"
                                        size={18}
                                        color={foreground}
                                      />
                                      <Text>Leave Group</Text>
                                    </Box>
                                  </MenuItem>
                                )}
                              </Menu>
                            </Box>
                          </Box>
                          <Box>
                            <Box flexDirection="row" marginTop="l">
                              <Box
                                borderWidth={1}
                                height={40}
                                borderRadius={6}
                                borderColor="faded"
                                justifyContent="center"
                                paddingHorizontal="s">
                                <Text color="label">All Posts</Text>
                              </Box>
                            </Box>
                            <Box></Box>
                          </Box>
                        </Box>
                      }
                      keyExtractor={({ id }) => id}
                      renderItem={({ item }) => (
                        <Box paddingHorizontal="l">
                          <PostItem
                            post={item}
                            postDelete={() => {
                              if (page === 1) {
                                loadPosts();
                              } else {
                                setPage(1);
                              }
                            }}
                          />
                        </Box>
                      )}
                    />
                  </Box>

                  {orderedPosts?.length > 0 && (
                    <Box position="absolute" bottom={20} right={30}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CreatePost', {
                            groupId: group?.id,
                          })
                        }>
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
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ViewGroupScreen;
