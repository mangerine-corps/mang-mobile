import { TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import { CommentReplies, CompleteComment, ErrorData } from '@/utils/types';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import Text from './Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useAuth } from '@/state/hooks/user.hook';
import {
  useDeleteCommentMutation,
  useGetCommentRepliessMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} from '@/state/services/posts.service';
import { showMessage } from 'react-native-flash-message';
import BottomSheet from './BottomSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import Button from './Button';
import ReportModal from './ReportModal';

interface Props {
  comment: CompleteComment;
  onReply: () => void;
  onDelete: () => void;
  lastUpdate?: string;
}

const ReplyItem = ({
  reply: r,
  onDelete,
}: {
  reply: CommentReplies;
  onDelete: Props['onDelete'];
}) => {
  const { foreground, label, danger, background, foreground_primary } =
    useThemeColors();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const [like, {}] = useLikeCommentMutation();
  const [unlike, {}] = useUnlikeCommentMutation();
  const [liked, setLiked] = useState(false);
  const [unliked, setUnLiked] = useState(false);
  const [reportPost, setReportPost] = useState(false);
  const deleteRef = useRef<ActionSheetRef>(null);
  const likedStatus =
    ((r?.likes || []).find(l => l.id === user?.id) && !unliked) || liked;
  const [remove, { isLoading: deleting }] = useDeleteCommentMutation();

  const removePost = useCallback(async () => {
    try {
      const response = await remove({
        id: r.id?.toString(),
      });
      console.log('removerep response:', JSON.stringify(response));
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
      onDelete();
      deleteRef.current?.hide();
    } catch (error) {
      console.log('remove comment error:', error);
    }
  }, [r?.id, remove, onDelete]);

  const likePost = useCallback(async () => {
    const wasUnliked = unliked;
    try {
      if (wasUnliked) {
        setUnLiked(false);
      } else {
        setLiked(true);
      }
      const response = await like({
        id: r.id as any,
        body: {
          userId: user?.id!,
        },
      });
      console.log('likepost response:', JSON.stringify(response));
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
      console.log('like comment error:', error);
      if (wasUnliked) {
        setUnLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [like, r?.id, unliked, user]);

  const unlikePost = useCallback(async () => {
    const wasLiked = liked;
    try {
      if (wasLiked) {
        setLiked(false);
      } else {
        setUnLiked(true);
      }
      const response = await unlike({
        id: r.id as any,
        body: {
          userId: user?.id!,
        },
      });
      console.log('unlikepost response:', JSON.stringify(response));
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
      console.log('unlike r error:', error);
      if (wasLiked) {
        setLiked(true);
      } else {
        setUnLiked(false);
      }
    }
  }, [liked, r?.id, unlike, user]);

  return (
    <>
      <Box>
        <ReportModal
          isVisible={reportPost}
          closeModal={() => setReportPost(false)}
          reportId={r.author.id}
          type="user"
        />
        <Box
          flexDirection="row"
          marginBottom="mid"
          justifyContent="space-between"
          gap="l"
          alignItems="center">
          <Box flex={1} flexDirection="row" alignItems="center" gap="s">
            <Box>
              <Box
                height={40}
                width={40}
                borderRadius={40}
                overflow="hidden"
                backgroundColor="black">
                <FastImage
                  source={{ uri: r?.author?.profilePics || '' }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                />
              </Box>
            </Box>
            <Box flex={1}>
              <Box
                flexDirection="row"
                alignItems="center"
                gap="mid"
                width="100%">
                <Box flex={1}>
                  <Text numberOfLines={1} fontSize={16} variant="semibold">
                    {r?.author?.fullName}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text color="label" numberOfLines={1}>
                    {moment(r?.createdAt).fromNow()}
                  </Text>
                </Box>
              </Box>
              <Box>{/* <Text color="label">{'User profession'}</Text> */}</Box>
            </Box>
          </Box>
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
              {user?.id === r?.author?.id ? (
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
                    <Text>Delete Comment</Text>
                  </Box>
                </MenuItem>
              ) : (
                <>
                  <MenuItem
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
                  </MenuItem>
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
        </Box>
        <Box gap="s" flexDirection="row">
          <Box width={32} />
          <Box flex={1}>
            <Text>{r.comment}</Text>
          </Box>
        </Box>

        <Box flexDirection="row" gap="s" alignItems="flex-start">
          <Box width={32} />
          <Box
            flex={1}
            marginTop="s"
            gap="l"
            flexDirection="row"
            alignItems="center">
            <TouchableOpacity
              onPress={() => {
                if (likedStatus) {
                  unlikePost();
                } else {
                  likePost();
                }
              }}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <Text>
                  {liked && likedStatus
                    ? r?.likeCount + 1
                    : unliked && !likedStatus
                    ? r?.likeCount - 1
                    : r?.likeCount}
                </Text>
                <Box>
                  <MaterialCommunityIcons
                    name={likedStatus ? 'thumb-up' : 'thumb-up-outline'}
                    size={18}
                    color={label}
                  />
                </Box>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
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
                loading={deleting}
                onPress={removePost}
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

const CommentItem = ({ comment, onReply, lastUpdate, onDelete }: Props) => {
  const { foreground, label, danger, foreground_primary, background } =
    useThemeColors();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const [like, {}] = useLikeCommentMutation();
  const [unlike, {}] = useUnlikeCommentMutation();
  const [liked, setLiked] = useState(false);
  const [unliked, setUnLiked] = useState(false);
  const [reportPost, setReportPost] = useState(false);
  const deleteRef = useRef<ActionSheetRef>(null);
  const likedStatus =
    ((comment?.likes || []).find(l => l.id === user?.id) && !unliked) || liked;
  const [getReplies] = useGetCommentRepliessMutation();
  const [replies, setReplies] = useState<CommentReplies[]>([]);
  const [remove, { isLoading: deleting }] = useDeleteCommentMutation();

  const likePost = useCallback(async () => {
    const wasUnliked = unliked;
    try {
      if (wasUnliked) {
        setUnLiked(false);
      } else {
        setLiked(true);
      }
      const response = await like({
        id: comment.id as any,
        body: {
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
      console.log('like comment error:', error);
      if (wasUnliked) {
        setUnLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [like, comment?.id, unliked, user]);

  const unlikePost = useCallback(async () => {
    const wasLiked = liked;
    try {
      if (wasLiked) {
        setLiked(false);
      } else {
        setUnLiked(true);
      }
      const response = await unlike({
        id: comment.id as any,
        body: {
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
      console.log('unlike comment error:', error);
      if (wasLiked) {
        setLiked(true);
      } else {
        setUnLiked(false);
      }
    }
  }, [liked, comment?.id, unlike, user]);

  const removePost = useCallback(async () => {
    try {
      const response = await remove({
        id: comment.id?.toString(),
      });
      // console.log('removepost response:', JSON.stringify(response));
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
      onDelete();
      deleteRef.current?.hide();
    } catch (error) {
      console.log('remove comment error:', error);
    }
  }, [comment?.id, remove, onDelete]);

  const fetchCommentReplies = useCallback(async () => {
    try {
      const response = await getReplies({
        params: {
          commentId: comment?.id?.toString(),
          order: 'DESC',
          page: 1,
          take: 50,
        },
      });
      // console.log('fetch replies res', JSON.stringify(response));
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
      setReplies((response as any)?.data?.data || []);
    } catch (error) {
      console.log('fetch post error:', error);
    }
  }, [comment?.id, getReplies]);

  useEffect(() => {
    if (liked && (comment?.likes || []).find(l => l.id === user?.id)) {
      setLiked(false);
    }
  }, [liked, comment, user?.id]);

  useEffect(() => {
    fetchCommentReplies();
  }, [fetchCommentReplies, lastUpdate]);

  return (
    <>
      <ReportModal
        isVisible={reportPost}
        closeModal={() => setReportPost(false)}
        reportId={comment.author.id}
        type="user"
      />
      <Box
        // borderWidth={1}
        paddingBottom="s"
        borderRadius={8}
        borderColor="minute_black">
        <Box>
          <Box
            flexDirection="row"
            marginBottom="mid"
            justifyContent="space-between"
            gap="mid"
            alignItems="center">
            <Box
              flex={1}
              flexDirection="row"
              overflow="hidden"
              alignItems="center"
              gap="s">
              <Box>
                <Box
                  height={50}
                  width={50}
                  borderRadius={50}
                  overflow="hidden"
                  backgroundColor="black">
                  <FastImage
                    source={{ uri: comment?.author?.profilePics || '' }}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 50,
                      overflow: 'hidden',
                    }}
                  />
                </Box>
              </Box>
              <Box flex={1}>
                <Box flexDirection="row" alignItems="center" gap="mid">
                  <Box flex={1}>
                    <Text fontSize={16} variant="semibold">
                      {comment?.author?.fullName}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      numberOfLines={1}
                      color="label"
                      lineBreakMode="middle">
                      {moment(comment?.createdAt).fromNow()}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  {/* <Text color="label">{'User profession'}</Text> */}
                </Box>
              </Box>
            </Box>
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
                {user?.id === comment?.author?.id ? (
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
                      <Text>Delete Comment</Text>
                    </Box>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem
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
                    </MenuItem>
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
          </Box>
          <Box gap="s" flexDirection="row">
            <Box width={32} />
            <Box flex={1}>
              <Text>{comment.comment}</Text>
            </Box>
          </Box>
          <Box flexDirection="row" gap="s" alignItems="flex-start">
            <Box width={32} />
            <Box
              flex={1}
              marginTop="s"
              gap="l"
              flexDirection="row"
              alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  if (likedStatus) {
                    unlikePost();
                  } else {
                    likePost();
                  }
                }}>
                <Box flexDirection="row" alignItems="center" gap="s">
                  <Text>
                    {liked && likedStatus
                      ? comment?.likeCount + 1
                      : unliked && !likedStatus
                      ? comment?.likeCount - 1
                      : comment?.likeCount}
                  </Text>
                  <Box>
                    <MaterialCommunityIcons
                      name={likedStatus ? 'thumb-up' : 'thumb-up-outline'}
                      size={18}
                      color={label}
                    />
                  </Box>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReply}>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Text color="label">Reply</Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
          <Box flexDirection="row" gap="s" alignItems="flex-start">
            <Box width={32} />
            <Box gap="m" flex={1} marginTop="m">
              {replies.map(r => (
                <ReplyItem
                  onDelete={() => {
                    setReplies(replies.filter(rep => rep.id !== r.id));
                  }}
                  reply={r}
                  key={r.id}
                />
              ))}
            </Box>
          </Box>
        </Box>
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
                loading={deleting}
                onPress={removePost}
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

export default CommentItem;
