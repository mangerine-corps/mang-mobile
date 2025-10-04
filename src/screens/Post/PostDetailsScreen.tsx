import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Box from '@/components/Box';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import Text from '@/components/Text';
import { useAuth } from '@/state/hooks/user.hook';
import { Menu, MenuItem } from 'react-native-material-menu';
import BottomSheet from '@/components/BottomSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import Button from '@/components/Button';
import ReportModal from '@/components/ReportModal';
import {
  useDeletePostMutation,
  useGetCommentsMutation,
  useGetPostMutation,
  usePostCommentMutation,
  useReplyCommentMutation,
  useViewPostMutation,
} from '@/state/services/posts.service';
import { Comment, CompleteComment, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import PostItem from '@/components/PostItem';
import FastImage from 'react-native-fast-image';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import CommentItem from '@/components/CommentItem';
import { orderBy } from 'lodash';
import EmptyState from '@/components/EmptyState';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

const PostDetailsScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'PostDetails'>) => {
  const { post: prePost } = route.params;
  const [activePost, setActivePost] = useState(prePost);
  const {
    foreground,
    danger,
    label,
    foreground_primary,
    placeholder,
    background,
  } = useThemeColors();
  const { regular } = useThemeText();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const deleteRef = useRef<ActionSheetRef>(null);
  const [reportPost, setReportPost] = useState(false);
  const [getPost, { isLoading }] = useGetPostMutation();
  const [remvoePost, { isLoading: removeLoading }] = useDeletePostMutation();
  const [viewPost, {}] = useViewPostMutation();
  const [getComments, { isLoading: commentsLoading }] =
    useGetCommentsMutation();
  const [postComment, { isLoading: postCommentLoading }] =
    usePostCommentMutation();
  const [postCommentReply, { isLoading: replyCommentLoading }] =
    useReplyCommentMutation();
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPage, setCommentsTotalPage] = useState(1);
  const [comment, setComment] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [comments, setComments] = useState<CompleteComment[]>([]);
  const post = activePost || prePost;
  const commentRef = useRef<TextInput>(null);
  const [replyId, setReplyId] = useState('');
  const [lastCommentsFetch, setLastCommentsFetch] = useState('');

  const orderedComments = useMemo(
    () => orderBy(comments, ['createdAt'], 'desc'),
    [comments],
  );

  const fetchPost = useCallback(async () => {
    try {
      const response = await getPost({
        id: post.id,
      });
      // console.log('fetch post res', JSON.stringify(response));
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
      await viewPost({
        // body: {
        //   postId: post?.id,
        //   userId: user?.id!,
        // },
        id: post?.id,
      });
      // console.log('view post res', JSON.stringify(viewresponse));
      setActivePost(p => ({
        ...p,
        ...(response as any)?.data?.data,
      }));
    } catch (error) {
      console.log('fetch post error:', error);
    }
  }, [getPost, post.id, viewPost]);

  const deletePost = useCallback(async () => {
    try {
      const response = await remvoePost({
        id: post?.id,
      });
      // console.log('likepost response:', JSON.stringify(response));
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
        navigation?.goBack();
      }, 500);
    } catch (error) {
      console.log('delete post error:', error);
    }
  }, [remvoePost, post?.id, navigation]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments({
        params: {
          order: 'ASC',
          page: 1,
          postId: post?.id,
          take: 50,
        },
      });
      // console.log('fetch comments res', JSON.stringify(response));
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
      const r = (response as any)?.data;
      setCommentsTotalPage(r?.meta?.pageCount || 1);
      setCommentsPage(r?.meta?.page || 1);
      setComments(r?.data);
      setLastCommentsFetch(new Date().toISOString());
    } catch (error) {
      console.log('fetch comments error:', error);
    }
  }, [getComments, post.id]);

  const addComment = useCallback(async () => {
    try {
      if (!comment.trim().length) {
        return;
      }
      const response = await postComment({
        body: {
          comment,
          postId: post.id,
          userId: user?.id as any,
        },
      });
      console.log('add comment res', JSON.stringify(response));
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
      Keyboard.dismiss();
      scrollRef.current?.scrollTo({
        animated: true,
        y: 0,
      });
      setComment('');
      const freshComments: Comment[] = (response as any)?.data?.comments || [];

      const mixedComments: CompleteComment[] = freshComments.map(f => {
        const availablComment = comments.find(c => c.id === f.id);
        return {
          author: f.creator,
          comment: f.comment,
          id: f.id,
          createdAt: f.createdAt,
          commentCount: availablComment?.commentCount || 0,
          likeCount: availablComment?.likeCount || 0,
          likes: availablComment?.likes || [],
          post: availablComment?.post || {
            id: post?.id,
          },
        };
      });

      setComments(mixedComments);
      setActivePost({
        ...post,
        commentCount: (response as any)?.data?.commentCount,
        reportCount: (response as any)?.data?.reportCount,
        likeCount: (response as any)?.data?.likeCount,
      });
    } catch (error) {
      console.log('add comment error:', error);
    }
  }, [comment, postComment, post, user?.id, comments]);

  const addReply = useCallback(async () => {
    try {
      if (!comment.trim().length || !replyId) {
        return;
      }
      const response = await postCommentReply({
        body: {
          commentId: replyId,
          replyContent: comment,
          userId: user?.id,
        },
        id: replyId,
      });
      // console.log('add comment res', JSON.stringify(response));
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
      fetchComments();
      Keyboard.dismiss();
      scrollRef.current?.scrollTo({
        animated: true,
        y: 0,
      });
      setComment('');
      setReplyId('');
    } catch (error) {
      console.log('add comment error:', error);
    }
  }, [comment, replyId, postCommentReply, user?.id, fetchComments]);

  const refreshAll = useCallback(async () => {
    if (commentsPage === 1) {
      fetchPost();
    } else {
      setCommentsPage(1);
    }
    fetchPost();
  }, [commentsPage, fetchPost]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  useEffect(() => {
    if (!isLoading && !commentsLoading) {
      setRefreshing(false);
    }
  }, [commentsLoading, isLoading]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              // keyboardVerticalOffset={15}
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
                      Post
                    </Text>
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
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
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
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={18}
                                color={danger}
                              />
                              <Text>Delete Post</Text>
                            </Box>
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          {/* <MenuItem
                            onPress={() => {
                              setMenuVisible(false);
                            }}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
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
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
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
                <Box flex={1}>
                  {isLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  <Box flex={1}>
                    <FlatList
                      onEndReachedThreshold={0.3}
                      onEndReached={() => {
                        if (
                          !commentsLoading &&
                          commentsPage < commentsTotalPage
                        ) {
                          setCommentsPage(commentsPage + 1);
                        }
                      }}
                      contentContainerStyle={{
                        gap: 16,
                      }}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={() => {
                            refreshAll();
                          }}
                        />
                      }
                      showsVerticalScrollIndicator={false}
                      data={orderedComments}
                      ListHeaderComponent={
                        <Box>
                          <Box paddingHorizontal="l">
                            <PostItem
                              post={post}
                              fullDetails
                              postDelete={() => {
                                navigation.goBack();
                              }}
                            />
                          </Box>
                        </Box>
                      }
                      ListEmptyComponent={
                        <Box paddingTop="xl" paddingHorizontal="xxl">
                          <EmptyState
                            subtitle="No Comment yet! Be the first to comment"
                            buttonText="Add comment"
                            doSomething={() => {
                              setReplyId('');
                              commentRef.current?.focus();
                            }}
                          />
                        </Box>
                      }
                      keyExtractor={({ id }) => id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.99}>
                          <Box paddingHorizontal="l">
                            <CommentItem
                              onReply={() => {
                                setReplyId(item?.id?.toString());
                                commentRef.current?.focus();
                              }}
                              comment={item}
                              lastUpdate={lastCommentsFetch}
                              onDelete={() => {
                                setComments(
                                  comments.filter(comm => comm.id !== item.id),
                                );
                              }}
                            />
                          </Box>
                        </TouchableOpacity>
                      )}
                    />

                    {commentsLoading && (
                      <Box padding="l" alignItems="center">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box
                    backgroundColor="searchbg"
                    flexDirection="row"
                    paddingHorizontal="l"
                    paddingTop="m"
                    paddingBottom="30"
                    gap="mid"
                    alignItems="center">
                    <Box>
                      <Box
                        height={48}
                        width={48}
                        borderRadius={48}
                        backgroundColor="black">
                        <FastImage
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 50,
                            overflow: 'hidden',
                          }}
                          resizeMode="cover"
                          source={{
                            uri: user?.profilePics || '',
                          }}
                        />
                      </Box>
                    </Box>
                    <Box flex={1} flexDirection="row">
                      <TextInput
                        value={comment}
                        ref={commentRef}
                        onChangeText={setComment}
                        placeholder="Add Comment..."
                        placeholderTextColor={placeholder}
                        style={{
                          flex: 1,
                          fontFamily: regular.fontFamily,
                          maxHeight: 40,
                          color: foreground,
                        }}
                        multiline
                      />
                    </Box>
                    <Box>
                      <TouchableOpacity
                        onPress={replyId ? addReply : addComment}
                        disabled={
                          !comment.trim().length ||
                          postCommentLoading ||
                          replyCommentLoading
                        }>
                        <Box>
                          {postCommentLoading || replyCommentLoading ? (
                            <ActivityIndicator
                              size="small"
                              color={foreground_primary}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="send-outline"
                              size={24}
                              color={
                                comment.trim().length
                                  ? foreground_primary
                                  : placeholder
                              }
                            />
                          )}
                        </Box>
                      </TouchableOpacity>
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
                      <TouchableOpacity
                        onPress={() => deleteRef.current?.hide()}>
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
                      This post wil be deleted from your feed. You won’t be able
                      to view it anymore. Are you sure?
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
              <ReportModal
                isVisible={reportPost}
                closeModal={() => setReportPost(false)}
                reportId={post.id}
                type="post"
              />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default PostDetailsScreen;
