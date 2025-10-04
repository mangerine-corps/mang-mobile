import { Share, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import { ErrorData, Post } from '@/utils/types';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Text from './Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import { truncate } from 'lodash';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useAuth } from '@/state/hooks/user.hook';
import {
  useDeletePostMutation,
  useLikePostMutation,
  useSharePostMutation,
} from '@/state/services/posts.service';
import { showMessage } from 'react-native-flash-message';
import BottomSheet from './BottomSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import Button from './Button';
import ViewImageModal from './ViewImageModal';
import ReportModal from './ReportModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

interface Props {
  post: Post;
  fullDetails?: boolean;
  profile?: boolean;
  postDelete?: () => void;
}

const PostItem = ({ post, fullDetails, profile, postDelete }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStack, any>>();
  const { foreground, label, danger, foreground_primary, background } =
    useThemeColors();
  const [viewMore, setViewMore] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const [like, {}] = useLikePostMutation();
  const [remvoePost, { isLoading: removeLoading }] = useDeletePostMutation();
  const [share, {}] = useSharePostMutation();
  const [liked, setLiked] = useState(false);
  const [unliked, setUnLiked] = useState(false);
  const [reportPost, setReportPost] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | undefined>(undefined);
  const deleteRef = useRef<ActionSheetRef>(null);
  const likedStatus =
    ((post?.likes || []).find(l => l.id === user?.id) && !unliked) || liked;

  const likePost = useCallback(async () => {
    const wasUnliked = unliked;
    try {
      if (wasUnliked) {
        setUnLiked(false);
      } else {
        setLiked(true);
      }
      const response = await like({
        body: {
          postId: post?.id,
          userId: user?.id!,
        },
      });
      // console.log('likepost response:', JSON.stringify(response));
      if (response?.error) {
        if (wasUnliked) {
          setUnLiked(true);
        } else {
          setLiked(false);
        }
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
    } catch (error) {
      console.log('like post error:', error);
      if (wasUnliked) {
        setUnLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [like, post?.id, unliked, user?.id]);

  const deletePost = useCallback(async () => {
    try {
      const response = await remvoePost({
        id: post?.id,
      });
      console.log('delete post response:', JSON.stringify(response));
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
      deleteRef.current?.hide();
      setTimeout(() => {
        postDelete && postDelete();
      }, 500);
    } catch (error) {
      console.log('delete post error:', error);
    }
  }, [remvoePost, post?.id, postDelete]);

  const unlikePost = useCallback(async () => {
    const wasLiked = liked;
    try {
      if (wasLiked) {
        setLiked(false);
      } else {
        setUnLiked(true);
      }
      const response = await like({
        body: {
          postId: post?.id,
          userId: user?.id!,
        },
      });
      // console.log('unlikepost response:', JSON.stringify(response));
      if (response?.error) {
        if (wasLiked) {
          setLiked(true);
        } else {
          setUnLiked(false);
        }
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
    } catch (error) {
      console.log('like post error:', error);
      if (wasLiked) {
        setLiked(true);
      } else {
        setUnLiked(false);
      }
    }
  }, [liked, post?.id, like, user?.id]);
  // console.log('liked', liked, post.content, post.likes, post.likeCount);

  const sharePost = useCallback(async () => {
    try {
      const response = await share({
        id: post?.id,
      });
      console.log('sharepost response:', JSON.stringify(response));
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
      const shareBase = `https://app.mangerine.com/posts/${
        (response as any)?.data?.shareableUrl || ''
      }`;
      Share.share({
        message: `View this post on mangerine ${shareBase}`,
        title: 'View on mangerine',
        url: shareBase,
      });
    } catch (error) {
      console.log('share post error:', error);
    }
  }, [post?.id, share]);

  useEffect(() => {
    if (liked && post.likes.find(l => l.id === user?.id)) {
      setLiked(false);
    }
  }, [liked, post.likes, user?.id]);

  return (
    <>
      <ReportModal
        isVisible={reportPost}
        closeModal={() => setReportPost(false)}
        reportId={post.id}
        type="post"
      />
      <ViewImageModal
        media={activeMedia}
        isVisible={activeMedia !== undefined}
        closeModal={() => setActiveMedia(undefined)}
        onReport={() => {
          setActiveMedia(undefined);
          setTimeout(() => {
            setReportPost(true);
          }, 900);
        }}
      />
      <Box
        borderWidth={1}
        paddingBottom="s"
        borderRadius={8}
        borderColor="minute_black">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PostDetails', {
              post: {
                ...post,
                likes: liked
                  ? [
                      ...post.likes,
                      {
                        followerCount: user?.followerCount!,
                        fullName: user?.fullName!,
                        id: user?.id!,
                        profilePics: user?.profilePics!,
                      },
                    ]
                  : unliked
                  ? post.likes.filter(l => l.id !== user?.id)
                  : post.likes,
              },
            });
          }}>
          <Box padding="s" style={{ paddingBottom: 0 }}>
            <Box
              flexDirection="row"
              marginBottom="mid"
              justifyContent="space-between"
              gap="l"
              alignItems="center">
              <Box flex={1} flexDirection="row" alignItems="center" gap="s">
                <Box>
                  <Box
                    height={32}
                    width={32}
                    borderRadius={32}
                    overflow="hidden"
                    backgroundColor="black">
                    <FastImage
                      source={{ uri: post?.creator?.profilePics || '' }}
                      style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: 32,
                        overflow: 'hidden',
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Text fontSize={16}>{post?.creator?.fullName}</Text>
                    {/* <Text color="label" fontSize={12}>
                      {'User profession'}
                    </Text> */}
                  </Box>
                  <Box>
                    <Text color="label">
                      {moment(post?.createdAt).fromNow()}
                    </Text>
                  </Box>
                </Box>
              </Box>
              {!fullDetails && (
                <Box>
                  <Menu
                    style={{
                      backgroundColor: background,
                    }}
                    visible={menuVisible}
                    anchor={
                      <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <MaterialCommunityIcons
                          name="dots-vertical"
                          size={24}
                          color={foreground}
                        />
                      </TouchableOpacity>
                    }
                    onRequestClose={() => setMenuVisible(false)}>
                    {user?.id === post?.creator?.id ? (
                      <>
                        <MenuItem
                          onPress={() => {
                            setMenuVisible(false);
                            setTimeout(() => {
                              navigation.navigate('CreatePost', {
                                post,
                              });
                            }, 900);
                          }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <FontelloCocoIcon
                              name="edit-1"
                              size={24}
                              color={foreground_primary}
                            />
                            <Text>Edit Post</Text>
                          </Box>
                        </MenuItem>
                        <MenuItem
                          onPress={() => {
                            setMenuVisible(false);
                            setTimeout(() => {
                              deleteRef.current?.show();
                            }, 900);
                          }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <MaterialCommunityIcons
                              name="trash-can-outline"
                              size={18}
                              color={danger}
                            />
                            <Text>Delete Post</Text>
                          </Box>
                        </MenuItem>
                        {profile && (
                          <MenuItem
                            onPress={() => {
                              setMenuVisible(false);
                              setTimeout(() => {
                                navigation.navigate('AddWork', {
                                  url: `https://app.mangerine.com/posts/${post?.id}`,
                                });
                              }, 900);
                            }}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
                              <MaterialCommunityIcons
                                name="plus"
                                size={18}
                                color={foreground}
                              />
                              <Text>Add to my works</Text>
                            </Box>
                          </MenuItem>
                        )}
                      </>
                    ) : (
                      <>
                        {/* <MenuItem
                          onPress={() => {
                            setMenuVisible(false);
                          }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <MaterialCommunityIcons
                              name="account-plus-outline"
                              size={18}
                              color={foreground}
                            />
                            <Text>Follow User</Text>
                          </Box>
                        </MenuItem> */}
                        <MenuItem
                          onPress={() => {
                            setMenuVisible(false);
                            setTimeout(() => {
                              setReportPost(true);
                            }, 800);
                          }}>
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <MaterialCommunityIcons
                              name="flag-outline"
                              size={18}
                              color={label}
                            />
                            <Text>Report Post</Text>
                          </Box>
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </Box>
              )}
            </Box>
            <Box gap="s">
              <Box>
                {fullDetails ? (
                  <Text>{post?.content}</Text>
                ) : (
                  <Text
                    onTextLayout={e => {
                      if (e.nativeEvent.lines.length > 4) {
                        setViewMore(true);
                      }
                    }}>
                    {viewMore
                      ? truncate(post?.content, {
                          length: 100,
                        })
                      : post?.content}
                    {viewMore && (
                      <Text
                        // onPress={() => setViewMore(false)}
                        variant="semibold"
                        color="foreground_primary">
                        View more
                      </Text>
                    )}
                  </Text>
                )}
              </Box>
              {post?.images?.length > 0 && (
                <Box
                  flexDirection="row"
                  gap="s"
                  borderRadius={6}
                  overflow="hidden">
                  {post.images.map(i => (
                    <Box
                      flex={1}
                      height={150}
                      borderRadius={6}
                      overflow="hidden"
                      key={i}>
                      <TouchableOpacity
                        onPress={() => setActiveMedia(i)}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 6,
                        }}>
                        <FastImage
                          source={{ uri: i }}
                          resizeMode="cover"
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 6,
                            overflow: 'hidden',
                          }}
                        />
                      </TouchableOpacity>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box
              marginTop="s"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  if (likedStatus) {
                    unlikePost();
                  } else {
                    likePost();
                  }
                }}>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box>
                    <MaterialCommunityIcons
                      name={likedStatus ? 'thumb-up' : 'thumb-up-outline'}
                      size={18}
                      color={label}
                    />
                  </Box>
                  <Text>
                    {liked && likedStatus
                      ? post?.likeCount + 1
                      : unliked && !likedStatus
                      ? post?.likeCount - 1
                      : post?.likeCount}
                  </Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box>
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={18}
                      color={label}
                    />
                  </Box>
                  <Text>{post?.commentCount}</Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box>
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={18}
                      color={label}
                    />
                  </Box>
                  <Text>{post?.viewCount || 0}</Text>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity onPress={sharePost}>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box>
                    <MaterialCommunityIcons
                      name="share-variant-outline"
                      size={18}
                      color={label}
                    />
                  </Box>
                  <Text>{post?.shareCount}</Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
      <BottomSheet backgroundColor="background" ref={deleteRef}>
        <Box paddingVertical="l">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Box flex={1}>
              <Text variant="semibold" fontSize={20}>
                Delete Post
              </Text>
            </Box>
            <Box>
              <TouchableOpacity onPress={() => deleteRef.current?.hide()}>
                <Box>
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={20}
                    color={foreground_primary}
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
          <Box marginTop="m" marginBottom="mxl">
            <Text>
              This post wil be deleted from your feed. You won’t be able to view
              it anymore. Are you sure?
            </Text>
          </Box>
          <Box flexDirection="row" marginBottom="l" gap="l">
            <Box flex={1}>
              <Button
                displayText="Yes, delete"
                buttonProps={{
                  backgroundColor: 'faded',
                }}
                onPress={deletePost}
                loading={removeLoading}
              />
            </Box>
            <Box flex={1}>
              <Button
                displayText="No, Cancel"
                onPress={() => deleteRef.current?.hide()}
              />
            </Box>
          </Box>
        </Box>
      </BottomSheet>
    </>
  );
};

export default PostItem;
