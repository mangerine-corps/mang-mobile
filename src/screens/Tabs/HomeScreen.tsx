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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList, MainStack } from '@/utils/ParamList';
import BottomTabHeader from '@/components/BottomTabHeader';
import Text from '@/components/Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import PostItem from '@/components/PostItem';
import { orderBy } from 'lodash';
import { useThemeColors } from '@/hooks/useTheme';
import EmptyState from '@/components/EmptyState';
import { usePaginatedPostsMutation } from '@/state/services/posts.service';
import { Post } from '@/utils/types';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/state/hooks/user.hook';
import { useBecomeConsultantMutation } from '@/state/services/users.service';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';

interface Props extends BottomTabScreenProps<BottomTabList, 'Home'> {}

const HomeScreen = ({}: Props) => {
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStack, 'Tabs'>>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { foreground_primary } = useThemeColors();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [getPosts, { isLoading }] = usePaginatedPostsMutation();
  // const [getTrending, { isLoading: trendingLoading }] = ise();
  const limit = 50;
  const [localPosts, setlocalPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [confirmConsultant, setConfirmConsultant] = useState(false);
  const { user } = useAuth();
  const [become, {}] = useBecomeConsultantMutation();
  const dispatch = useDispatch();

  const loadPaginated = useCallback(async () => {
    try {
      const response = await getPosts({
        params: {
          limit,
          page,
        },
      });
      console.log('response', JSON.stringify(response));
      if ((response as any)?.error) {
        // const err = response as any as ErrorData;
        return;
      }
      setTotalPages((response as any)?.data?.data?.totalPages || 1);
      if (page === 1) {
        setlocalPosts((response as any)?.data?.data?.items || []);
      } else {
        setlocalPosts(x => [
          ...x,
          ...((response as any)?.data?.data?.items || []),
        ]);
      }
    } catch (error) {
      console.log('paginated posts error', JSON.stringify(error));
    }
  }, [getPosts, page]);

  const orderedPosts = useMemo(
    () =>
      orderBy(
        localPosts?.filter(
          p =>
            p?.content?.toLowerCase()?.includes(search?.toLowerCase()) ||
            p?.creator?.fullName
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()),
        ),
        ['createdAt'],
        'desc',
      ),
    [localPosts, search],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadPaginated();
  }, [loadPaginated]);

  useEffect(() => {
    if (!user?.isConsultant) {
      setTimeout(() => {
        setConfirmConsultant(true);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPaginated();
    }, [loadPaginated]),
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <ConfirmModal
              title="Have knowledge or skills to share?"
              closeModal={() => setConfirmConsultant(false)}
              isVisible={confirmConsultant}
              subtitle="Join our community of consultants and start earning by helping others. Set your own hours, choose your rates, and make an impact."
              confirmButton="Become a consultant"
              cancelButton="Not Now"
              confirm={() => {
                setConfirmConsultant(false);
                setTimeout(async () => {
                  try {
                    await become({});
                    dispatch(
                      setAuthTrigger({
                        trigger: true,
                      }),
                    );
                  } catch (error) {
                    console.log('become error:', error);
                  }
                  // navigation.navigate('MyConsultation');
                }, 900);
              }}
            />
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1} position="relative">
                <BottomTabHeader
                  searchValue={search}
                  setSearchValue={setSearch}
                />
                <Box flex={1} onStartShouldSetResponder={() => true}>
                  {isLoading && orderedPosts.length < 1 && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  <FlatList
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                      if (!isLoading && page < totalPages) {
                        setPage(page + 1);
                      }
                    }}
                    refreshing={isRefreshing && isLoading}
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing && isLoading}
                        onRefresh={() => {
                          if (page === 1) {
                            loadPaginated();
                          } else {
                            setPage(1);
                          }
                          setIsRefreshing(true);
                        }}
                      />
                    }
                    data={orderedPosts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: 16,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                    }}
                    ListEmptyComponent={
                      <Box>
                        <EmptyState
                          subtitle="No posts here yet"
                          buttonText="Create Post"
                          doSomething={() =>
                            mainNavigation.navigate('CreatePost')
                          }
                        />
                      </Box>
                    }
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => (
                      <PostItem
                        post={item}
                        postDelete={() => {
                          if (page === 1) {
                            loadPaginated();
                          } else {
                            setPage(1);
                          }
                          setIsRefreshing(true);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box position="absolute" bottom={20} right={30}>
                  <TouchableOpacity
                    onPress={() => mainNavigation.navigate('CreatePost')}>
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
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default HomeScreen;
