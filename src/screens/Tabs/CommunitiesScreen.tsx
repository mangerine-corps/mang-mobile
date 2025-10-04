import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  // ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList, MainStack } from '@/utils/ParamList';
import { useGetPaginatedCommunitiesMutation } from '@/state/services/community.service';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import BottomTabHeader from '@/components/BottomTabHeader';
import Input from '@/components/Input';
import { useThemeColors } from '@/hooks/useTheme';
import { ErrorData, Group } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import EmptyState from '@/components/EmptyState';
import GroupItem from '@/components/GroupItem';
import ConfirmModal from '@/components/ConfirmModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoadGroups } from '@/state/hooks/loadgroups.hook';
import { useGroups } from '@/state/hooks/groups.hook';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
// import { uniq } from 'lodash';

interface Props extends BottomTabScreenProps<BottomTabList, 'Communities'> {}

const CommunitiesScreen = ({}: Props) => {
  const { placeholder, foreground_primary, background } = useThemeColors();
  const [precommunities, setCOmmunities] = useState<Group[]>([]);
  const [getGroups, { isLoading }] = useGetPaginatedCommunitiesMutation();
  const [showSearch, setShowSearch] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [tab, setTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  // const categories = ['All', 'Business', 'Health', 'Career', 'Finance'];
  const [selectedCategory, setSelectedCategory] = useState('');
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  const { loadJoinedGroups, joinedGroupsLoading } = useLoadGroups();
  const { loadInterests } = useLoadAuth();
  const { joinedGroups = [] } = useGroups();
  const empty = useMemo(
    () => !joinedGroups.length && !precommunities.length,
    [precommunities, joinedGroups],
  );
  const { interests = [] } = useAuth();
  const categories = useMemo(
    () => [
      {
        createdAt: '',
        id: '',
        name: 'All',
        updatedAt: '',
      },
      ...interests,
    ],
    [interests],
  );
  const communities = useMemo(
    () =>
      selectedCategory === ''
        ? precommunities.filter(
            x =>
              x?.name?.toLowerCase().includes(search?.toLowerCase()) ||
              x?.rules?.toLowerCase().includes(search?.toLowerCase()) ||
              x?.questionnaire?.toLowerCase().includes(search?.toLowerCase()) ||
              x?.description?.toLowerCase().includes(search?.toLowerCase()),
          )
        : precommunities
            .filter(x => x.category?.id === selectedCategory)
            .filter(
              x =>
                x?.name?.toLowerCase().includes(search?.toLowerCase()) ||
                x?.rules?.toLowerCase().includes(search?.toLowerCase()) ||
                x?.questionnaire
                  ?.toLowerCase()
                  .includes(search?.toLowerCase()) ||
                x?.description?.toLowerCase().includes(search?.toLowerCase()),
            ),
    [precommunities, selectedCategory, search],
  );

  const loadGroups = useCallback(async () => {
    try {
      const response = await getGroups({
        params: {
          limit,
          page,
        },
      });
      console.log('groups response', response);
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
      if (page === 1) {
        setCOmmunities((response as any)?.data?.data?.result || []);
      } else {
        setCOmmunities(x => [
          ...x,
          ...((response as any)?.data?.data?.result || []),
        ]);
      }
      setTotalPages(
        Math.ceil(((response as any)?.data?.data?.total || 0) / limit),
      );
    } catch (error) {
      console.log('groups error:', error);
    }
  }, [getGroups, page]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    loadInterests();
  }, [loadInterests]);

  useEffect(() => {
    loadJoinedGroups();
  }, [loadJoinedGroups]);

  useFocusEffect(
    React.useCallback(() => {
      loadGroups();
    }, [loadGroups]),
  );

  useEffect(() => {
    if (!isLoading && !joinedGroupsLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading, joinedGroupsLoading]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1} position="relative">
                <BottomTabHeader
                  onSearch={() => {
                    setShowSearch(!showSearch);
                    setSearch('');
                  }}
                />
                <Box flex={1} position="relative">
                  {showSearch && (
                    <Box
                      flexDirection="row"
                      marginTop="m"
                      gap="s"
                      paddingHorizontal="l">
                      <Box flex={1}>
                        <Input
                          leftComponent={
                            <MaterialCommunityIcons
                              name="magnify"
                              size={24}
                              color={placeholder}
                            />
                          }
                          backgroundColor="white"
                          borderWidth={0}
                          placeholder="Search Groups"
                          value={search}
                          onChangeText={setSearch}
                        />
                      </Box>
                      <Box>
                        <TouchableOpacity>
                          <Box
                            backgroundColor="white"
                            height={50}
                            justifyContent="center"
                            alignItems="center"
                            width={50}
                            borderRadius={8}>
                            <FontAwesome
                              name="sliders"
                              color={foreground_primary}
                              size={24}
                            />
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )}
                  {isLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}

                  {!empty && (
                    <Box>
                      <Box
                        flexDirection="row"
                        paddingHorizontal="l"
                        gap="mid"
                        marginBottom="l">
                        <Box
                          paddingBottom="s"
                          paddingHorizontal="mid"
                          borderBottomColor={
                            tab === 'all' ? 'foreground_primary' : 'transparent'
                          }
                          borderBottomWidth={1}>
                          <TouchableOpacity onPress={() => setTab('all')}>
                            <Text
                              variant="semibold"
                              color={
                                tab === 'all' ? 'foreground_primary' : 'faded'
                              }>
                              All Groups
                            </Text>
                          </TouchableOpacity>
                        </Box>
                        <Box
                          paddingBottom="s"
                          paddingHorizontal="mid"
                          borderBottomColor={
                            tab === 'my' ? 'foreground_primary' : 'transparent'
                          }
                          borderBottomWidth={1}>
                          <TouchableOpacity onPress={() => setTab('my')}>
                            <Text
                              variant="semibold"
                              color={
                                tab === 'my' ? 'foreground_primary' : 'faded'
                              }>
                              My Groups
                            </Text>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                      {tab === 'all' && (
                        <Box>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="m"
                              paddingHorizontal="l">
                              {categories.map(c => (
                                <TouchableOpacity
                                  onPress={() => setSelectedCategory(c.id)}
                                  key={c.name}>
                                  <Box
                                    height={34}
                                    borderRadius={6}
                                    justifyContent="center"
                                    paddingHorizontal="mid"
                                    borderColor={
                                      selectedCategory === c.id
                                        ? 'foreground_primary'
                                        : 'label'
                                    }
                                    borderWidth={1}>
                                    <Text
                                      color={
                                        selectedCategory === c.id
                                          ? 'foreground_primary'
                                          : 'label'
                                      }
                                      fontSize={12}
                                      variant="semibold">
                                      {c.name}
                                    </Text>
                                  </Box>
                                </TouchableOpacity>
                              ))}
                            </Box>
                          </ScrollView>
                        </Box>
                      )}
                    </Box>
                  )}
                  {(isLoading || joinedGroupsLoading) &&
                    (communities.length < 1 || joinedGroups.length < 1) && (
                      <Box alignItems="center" padding="l">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                  {tab === 'all' && (
                    <Box flex={1}>
                      <FlatList
                        refreshing={isRefreshing && isLoading}
                        refreshControl={
                          <RefreshControl
                            refreshing={isRefreshing && isLoading}
                            onRefresh={() => {
                              if (page === 1) {
                                loadGroups();
                              } else {
                                setPage(1);
                              }
                              setIsRefreshing(true);
                            }}
                          />
                        }
                        onEndReachedThreshold={0.3}
                        onEndReached={() => {
                          if (!isLoading && page < totalPages) {
                            setPage(page + 1);
                          }
                        }}
                        onStartShouldSetResponder={() => true}
                        contentContainerStyle={{
                          paddingHorizontal: 24,
                          gap: 8,
                          paddingBottom: 80,
                        }}
                        style={{
                          flex: 1,
                          marginTop: 24,
                        }}
                        data={communities}
                        renderItem={({ item }) => <GroupItem item={item} />}
                        ListEmptyComponent={
                          <Box minHeight={500} justifyContent="center">
                            <EmptyState
                              subtitle="No groups here yet"
                              buttonText={'Create group'}
                              doSomething={() => {
                                // setEmpty(false);
                                mainNavigation.navigate('CreateGroup');
                              }}
                            />
                          </Box>
                        }
                      />
                    </Box>
                  )}
                  {tab === 'my' && (
                    <Box flex={1}>
                      <FlatList
                        refreshing={isRefreshing && joinedGroupsLoading}
                        refreshControl={
                          <RefreshControl
                            refreshing={isRefreshing && joinedGroupsLoading}
                            onRefresh={() => {
                              loadJoinedGroups();
                              setIsRefreshing(true);
                            }}
                          />
                        }
                        onStartShouldSetResponder={() => true}
                        contentContainerStyle={{
                          paddingHorizontal: 24,
                          gap: 8,
                          paddingBottom: 80,
                        }}
                        style={{
                          flex: 1,
                        }}
                        data={joinedGroups}
                        renderItem={({ item }) => (
                          <GroupItem joined item={item} />
                        )}
                        ListEmptyComponent={
                          <Box minHeight={500} justifyContent="center">
                            <EmptyState
                              subtitle="No groups here yet"
                              buttonText={'Create group'}
                              doSomething={() => {
                                // setEmpty(false);
                                mainNavigation.navigate('CreateGroup');
                              }}
                            />
                          </Box>
                        }
                      />
                    </Box>
                  )}
                  {!empty && (
                    <Box position="absolute" bottom={20} right={30}>
                      <TouchableOpacity
                        onPress={() => {
                          // setEmpty(false);
                          // setConfirm(true);

                          mainNavigation.navigate('CreateGroup');
                        }}>
                        <Box
                          paddingHorizontal="m"
                          height={50}
                          borderRadius={100}
                          backgroundColor="button_primary"
                          alignItems="center"
                          flexDirection="row"
                          gap="s">
                          <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color={background}
                          />
                          <Text variant="bold" fontSize={12} color="background">
                            Create Group
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  )}
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
          <ConfirmModal
            title="Ready to Create Your Own Group?"
            subtitle="This feature is available with our Premium plan. Upgrade now to start building and managing your Group!"
            confirmButton="Upgrade"
            cancelButton="Maybe Later"
            closeModal={() => setConfirm(false)}
            confirm={() => {
              setConfirm(false);
              setTimeout(() => {
                mainNavigation.navigate('CreateGroup');
              }, 900);
            }}
            isVisible={confirm}
          />
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default CommunitiesScreen;
