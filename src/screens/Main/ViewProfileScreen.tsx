import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import { MainStack } from '@/utils/ParamList';
import { useAuth } from '@/state/hooks/user.hook';
import Image from 'react-native-fast-image';
import CocoIcon from '@/utils/custom-fonts/CocoIcon';
import Text from '@/components/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { addAlpha } from '@/utils/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileWorksSection from '@/components/ProfileWorksSection';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import moment from 'moment';
import {
  Consultant,
  Education,
  ErrorData,
  Experience,
  Language,
  Post,
  Skill,
  User,
  Work,
} from '@/utils/types';
import { usePosts } from '@/state/hooks/posts.hook';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import PostItem from '@/components/PostItem';
import EmptyState from '@/components/EmptyState';
import Video from 'react-native-video';
import { useUserPostsMutation } from '@/state/services/posts.service';
import Button from '@/components/Button';
import { Menu, MenuItem } from 'react-native-material-menu';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import ConfirmModal from '@/components/ConfirmModal';
import ReportModal from '@/components/ReportModal';
import {
  useFollowUserMutation,
  useGetFollowersMutation,
  useGetFollowingMutation,
  useGetUserInfoMutation,
  useUnfollowUserMutation,
} from '@/state/services/users.service';
import { showMessage } from 'react-native-flash-message';
import { useDispatch } from 'react-redux';
import {
  examplePricingData,
  setAuthTrigger,
} from '@/state/reducers/user.reducer';
import ServicesCarousel from '@/components/ServicesCarousel';
import {
  useGetConsultantMutation,
  useGetConsultantPricingByIdMutation,
} from '@/state/services/consultants.service';

type NuType = NativeStackScreenProps<MainStack, 'ViewProfile'>;

export const exampleconsultationTime = {
  id: 8,
  availability: [
    {
      day: 'Monday',
      slots: [
        {
          to: ['7:00 PM'],
          from: ['7:00 AM'],
        },
      ],
      enabled: true,
      duration: ['60'],
    },
    {
      day: 'Tuesday',
      slots: [
        {
          to: ['5:00 PM'],
          from: ['9:00 AM'],
        },
      ],
      enabled: true,
      duration: ['60'],
    },
  ],
  timezone: '(UTC+1:00) West Africa Time',
  createdAt: '2025-07-08T20:28:59.128Z',
  updatedAt: '2025-07-08T20:28:59.128Z',
};

// interface Props extends BottomTabScreenProps<BottomTabList, 'Profile'> {}

const ViewProfileScreen = ({ route, navigation }: NuType) => {
  const {
    user: preUser,
    skills: preSkills = [],
    education: preEducation = [],
    experience: preExperience = [],
    languages: preLanguages = [],
    follows: userFollows = [],
  } = useAuth();
  const { label, foreground_primary, foreground, background } =
    useThemeColors();
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStack, 'Tabs'>>();
  const tabs = ['Activity Feeds', 'Consulting', 'Reviews'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const {} = usePosts();
  const userId = route?.params?.userId;
  const passedUser = route?.params?.user as Consultant | undefined;
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [updatedUser, setUpdatedUser] = useState(passedUser);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [reportUser, setReportUser] = useState(false);
  const user = updatedUser || preUser;
  const works: Work[] = passedUser?.works || [];
  const isUser =
    (!userId && !passedUser) ||
    passedUser?.id === preUser?.id ||
    (userId !== undefined && userId === user?.id);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [follows, setFollows] = useState<User[]>([]);
  const [followsCount, setFollowsCount] = useState(0);
  const [getUserPosts, {}] = useUserPostsMutation();
  const [getConsultant, {}] = useGetUserInfoMutation();
  const [getConsultantInfo, {}] = useGetConsultantMutation();
  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();
  const [paused] = useState(true);
  const [unfollowUser, { isLoading: unfollowLoading }] =
    useUnfollowUserMutation();
  const [getPricing] = useGetConsultantPricingByIdMutation();
  const [pricingData, setPricingData] = useState<
    typeof examplePricingData | undefined
  >(undefined);
  // const [favUser, { isLoading: favLoading }] = useFavouriteConsultantMutation();
  // const [unFavUser, { isLoading: unfavLoading }] =
  //   useUnfavouriteConsultantMutation();
  const [getFollowers, {}] = useGetFollowersMutation();
  const [getFollows, {}] = useGetFollowingMutation();
  const [consultationTime, setConsultationTime] = useState<
    typeof exampleconsultationTime | undefined
  >(undefined);
  const languages: Language[] = passedUser
    ? updatedUser?.languages || []
    : preLanguages || [];
  const skills: Skill[] = passedUser
    ? updatedUser?.skills || []
    : preSkills || [];
  const education: Education[] = passedUser
    ? updatedUser?.educations || []
    : preEducation || [];
  const experience: Experience[] = passedUser
    ? updatedUser?.experiences || []
    : preExperience || [];
  const followingUser = useMemo(
    () => userFollows.find(u => u?.id === user?.id) !== undefined,
    [userFollows, user],
  );
  const dispatch = useDispatch();

  const loadUserPosts = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getUserPosts(passedUser?.id);
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
      // console.log('response', JSON.stringify(response));
      setUserPosts((response as any)?.data?.data || []);
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [getUserPosts, passedUser]);

  const loadConsultantInfo = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getConsultantInfo({
        id: passedUser?.id,
      });
      // console.log('response', JSON.stringify(response?.data));
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
      setConsultationTime((response as any)?.data?.data?.consultationTime);
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [getConsultantInfo, passedUser]);

  const loadPricing = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getPricing({
        id: passedUser?.id,
      });
      // console.log('response', JSON.stringify(response?.data));
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
      setPricingData(
        (response as any)?.data?.data?.consultant?.pricing || undefined,
      );
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [getPricing, passedUser]);

  const loadConsultant = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getConsultant({
        id: passedUser?.id,
      });
      // console.log('response', JSON.stringify(response?.data));
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
      setUpdatedUser((response as any)?.data);
      if ((response as any)?.data?.isConsultant) {
        loadConsultantInfo();
        loadPricing();
      }
    } catch (error) {
      console.log('posts error', JSON.stringify(error));
    }
  }, [getConsultant, passedUser, loadConsultantInfo, loadPricing]);

  const loadFollowers = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getFollowers({
        id: passedUser?.id,
        params: {
          limit: 50,
          page: 1,
        },
      });
      // console.log('followers response', JSON.stringify(response));
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
      setFollowers((response as any)?.data?.data || []);
      setFollowersCount((response as any)?.data?.total || 0);
      // setUpdatedUser((response as any)?.data?.data?.consultant);
    } catch (error) {
      console.log('get followers error', JSON.stringify(error));
    }
  }, [getFollowers, passedUser]);

  const loadFollows = useCallback(async () => {
    try {
      if (!passedUser?.id) {
        return;
      }
      const response = await getFollows({
        id: passedUser?.id,
        params: {
          limit: 50,
          page: 1,
        },
      });
      // console.log('follows response', JSON.stringify(response));
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
      setFollows((response as any)?.data?.data || []);
      setFollowsCount((response as any)?.data?.total || 0);
    } catch (error) {
      console.log('get follows error', JSON.stringify(error));
    }
  }, [getFollows, passedUser]);

  const handleFollow = useCallback(async () => {
    try {
      const response = await followUser({
        currentUser: preUser?.id!,
        targetUser: user?.id!,
      });
      // console.log('follow response', JSON.stringify(response));
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
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      loadFollowers();
    } catch (error) {
      console.log('follow error:', error);
    }
  }, [followUser, preUser?.id, user?.id, loadFollowers, dispatch]);

  const handleUnfollow = useCallback(async () => {
    try {
      const response = await unfollowUser({
        currentUser: preUser?.id!,
        targetUser: user?.id!,
      });
      // console.log('follow response', JSON.stringify(response));
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
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      loadFollowers();
    } catch (error) {
      console.log('follow error:', error);
    }
  }, [unfollowUser, preUser?.id, user?.id, loadFollowers, dispatch]);

  // const handleFav = useCallback(async () => {
  //   try {
  //     const response = await favUser({
  //       body: {
  //         consultantId: user?.id!,
  //         userId: preUser?.id!,
  //       },
  //     });
  //     console.log('fav response', JSON.stringify(response));
  //     if (response?.error) {
  //       const err = response as ErrorData;
  //       showMessage({
  //         message:
  //           err?.error?.data?.message ||
  //           err?.error?.data?.error ||
  //           'Something went wrong',
  //         type: 'danger',
  //       });
  //       return;
  //     }
  //   } catch (error) {
  //     console.log('fav error:', error);
  //   }
  // }, [favUser, preUser?.id, user?.id]);

  useEffect(() => {
    loadUserPosts();
    loadConsultant();
    loadFollowers();
    loadFollows();
  }, [loadUserPosts, loadConsultant, loadFollowers, loadFollows]);

  return (
    <BaseScreenComponent>
      <Box flex={1}>
        <ReportModal
          isVisible={reportUser}
          closeModal={() => setReportUser(false)}
          reportId={user?.id!}
          type="user"
        />
        <ConfirmModal
          closeModal={() => setConfirmBlock(false)}
          isVisible={confirmBlock}
          title={`Are you sure you want to block ${user?.fullName}?`}
          subtitle="You won't be able to see their profile or messages, and they won't be able to contact you."
          confirmButton="Yes, block"
          confirm={() => {
            setConfirmBlock(false);
          }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box>
                  <Box paddingHorizontal="l" marginTop="mid">
                    <Box overflow="hidden" paddingBottom="l" borderRadius={12}>
                      <TouchableOpacity
                        disabled={!isUser}
                        activeOpacity={0.98}
                        onPress={() => {
                          // navigation.navigate('Profile');
                        }}>
                        <Box
                          height={106}
                          backgroundColor="black"
                          position="relative">
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            height="100%"
                            width="100%">
                            <Image
                              style={{ height: '100%', width: '100%' }}
                              resizeMode="cover"
                              source={{ uri: user?.profileBanner || '' }}
                            />
                          </Box>
                          <Box
                            flexDirection="row"
                            marginTop="s"
                            alignItems="center"
                            justifyContent="space-between">
                            <TouchableOpacity onPress={navigation.goBack}>
                              <Box
                                height={40}
                                justifyContent="center"
                                alignItems="center"
                                width={40}
                                borderRadius={8}
                                style={{
                                  backgroundColor: addAlpha('#000000', 0.4),
                                }}>
                                <MaterialCommunityIcons
                                  name="arrow-left"
                                  size={20}
                                  color="#FFF"
                                />
                              </Box>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Box
                                height={40}
                                justifyContent="center"
                                alignItems="center"
                                width={40}
                                borderRadius={8}
                                style={{
                                  backgroundColor: addAlpha('#000000', 0.4),
                                }}>
                                <Ionicons
                                  name="share-outline"
                                  size={20}
                                  color="#FFF"
                                />
                              </Box>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      </TouchableOpacity>
                      <Box>
                        <Box
                          marginLeft="l"
                          style={{ marginTop: -30 }}
                          justifyContent="space-between"
                          alignItems="flex-start"
                          flexDirection="row">
                          <TouchableOpacity
                            disabled={isUser}
                            onPress={() => {
                              // navigation.navigate('Profile');
                            }}>
                            <Box
                              height={100}
                              borderRadius={100}
                              width={104}
                              overflow="hidden"
                              borderColor="label"
                              backgroundColor="foreground_primary"
                              borderWidth={8}>
                              <Image
                                style={{ height: '100%', width: '100%' }}
                                resizeMode="cover"
                                source={{ uri: user?.profilePics || '' }}
                              />
                            </Box>
                          </TouchableOpacity>
                          <Box marginTop="30" paddingTop="s" flex={1}>
                            <Box flexDirection="row" alignItems="flex-start">
                              <Box paddingHorizontal="m" flex={1}>
                                <Text variant="bold" fontSize={16}>
                                  {user?.fullName}
                                </Text>
                                <Text marginVertical="xs">{user?.title}</Text>
                              </Box>
                              {isUser && (
                                <TouchableOpacity
                                  onPress={() => {
                                    mainNavigation.navigate('EditProfile');
                                  }}>
                                  <CocoIcon
                                    name="edit-1"
                                    size={24}
                                    color={foreground_primary}
                                  />
                                </TouchableOpacity>
                              )}
                              {!isUser && (
                                <Box flexDirection="row" gap="s">
                                  {/* <TouchableOpacity onPress={handleFav}>
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
                                  </TouchableOpacity> */}
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
                                    onRequestClose={() =>
                                      setMenuVisible(false)
                                    }>
                                    <MenuItem
                                      onPress={() => {
                                        setMenuVisible(false);
                                      }}>
                                      <Box
                                        flexDirection="row"
                                        alignItems="center"
                                        gap="s">
                                        <MaterialCommunityIcons
                                          name="link"
                                          size={18}
                                          color={foreground}
                                        />
                                        <Text>Copy link to profile</Text>
                                      </Box>
                                    </MenuItem>
                                    <MenuItem
                                      onPress={() => {
                                        setMenuVisible(false);
                                      }}>
                                      <Box
                                        flexDirection="row"
                                        alignItems="center"
                                        gap="s">
                                        <CocoIcon
                                          name="volume-cross"
                                          size={18}
                                          color={foreground}
                                        />
                                        <Text>Mute {user?.fullName}</Text>
                                      </Box>
                                    </MenuItem>
                                    <MenuItem
                                      onPress={() => {
                                        setMenuVisible(false);
                                        setTimeout(() => {
                                          setConfirmBlock(true);
                                        }, 900);
                                      }}>
                                      <Box
                                        flexDirection="row"
                                        alignItems="center"
                                        gap="s">
                                        <MaterialCommunityIcons
                                          name="minus-circle-outline"
                                          size={18}
                                          color={foreground}
                                        />
                                        <Text>Block {user?.fullName}</Text>
                                      </Box>
                                    </MenuItem>
                                    <MenuItem
                                      onPress={() => {
                                        setMenuVisible(false);
                                        setTimeout(() => {
                                          setReportUser(true);
                                        }, 900);
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
                                        <Text>Report User</Text>
                                      </Box>
                                    </MenuItem>
                                  </Menu>
                                </Box>
                              )}
                            </Box>
                            <Box
                              alignItems="flex-start"
                              flexDirection="row"
                              gap="mid"
                              paddingHorizontal="m">
                              <Box
                                flexDirection="row"
                                flex={1}
                                maxWidth={user?.dateOfBirth ? '42%' : undefined}
                                alignItems="flex-start">
                                <CocoIcon
                                  name="location"
                                  size={16}
                                  color={label}
                                />
                                <Box flex={1}>
                                  <Text numberOfLines={2} fontSize={10}>
                                    {user?.location}
                                  </Text>
                                </Box>
                              </Box>
                              {user?.dateOfBirth && (
                                <Box
                                  flexDirection="row"
                                  flex={1}
                                  alignItems="flex-start">
                                  <CocoIcon
                                    name="user"
                                    size={16}
                                    color={label}
                                  />
                                  <Text fontSize={10}>
                                    Born{' '}
                                    {moment(user?.dateOfBirth).format('D MMMM')}
                                  </Text>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box marginTop="s" marginBottom="m">
                        <Box marginTop="mid">
                          <Text numberOfLines={7}>{user?.bio}</Text>
                        </Box>
                      </Box>
                      <Box flexDirection="row" alignItems="center" gap="m">
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('UserFollowers', {
                              user: user!,
                              users: followers || [],
                            });
                          }}>
                          <Text fontSize={12} color="foreground_primary">
                            {followersCount || 0} Follower(s)
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('UserFollowing', {
                              user: user!,
                              users: follows || [],
                            });
                          }}>
                          <Text fontSize={12} color="foreground_primary">
                            {followsCount || 0} Following
                          </Text>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                    <Box flexDirection="row" gap="mid" marginBottom="m">
                      <Box flex={1}>
                        <Button
                          loading={followLoading || unfollowLoading}
                          onPress={
                            followingUser ? handleUnfollow : handleFollow
                          }
                          buttonProps={{
                            backgroundColor: 'background',
                            borderWidth: 1,
                            borderColor: 'foreground_primary',
                          }}
                          textProps={{
                            color: 'foreground_primary',
                          }}
                          displayText={followingUser ? 'Unfollow' : 'Follow'}
                        />
                      </Box>
                      <Box flex={1}>
                        <Button
                          onPress={() =>
                            navigation.navigate('BookConsultation', {
                              consultant: user as Consultant,
                            })
                          }>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <CocoIcon
                              name="calendar"
                              color="#FFFFFF"
                              size={24}
                            />
                            <Text
                              variant="semibold"
                              fontSize={16}
                              color="white">
                              Book Consult
                            </Text>
                          </Box>
                        </Button>
                      </Box>
                    </Box>
                    <Box>
                      <ProfileWorksSection
                        works={works}
                        name={user?.fullName}
                      />
                    </Box>
                    <Box marginTop="m" marginBottom="xl">
                      <Box flexDirection="row" alignItems="center" gap="m">
                        {tabs.map(t => (
                          <Box flex={1} key={t}>
                            <TouchableOpacity onPress={() => setActiveTab(t)}>
                              <Box
                                height={48}
                                borderBottomWidth={1}
                                borderBottomColor={
                                  activeTab === t
                                    ? 'foreground_primary'
                                    : 'transparent'
                                }
                                justifyContent="center"
                                alignItems="center">
                                <Text
                                  color={
                                    activeTab === t
                                      ? 'foreground_primary'
                                      : 'label'
                                  }
                                  variant={
                                    activeTab === t ? 'semibold' : 'regular'
                                  }>
                                  {t}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          </Box>
                        ))}
                      </Box>
                      <Box>
                        <Animated.View
                          entering={FadeInLeft}
                          exiting={FadeOutRight}
                          key={`activeTab-${activeTab}`}
                          style={{
                            // borderWidth: 1,
                            minHeight: 150,
                          }}>
                          <Box marginTop="m">
                            {/* <Text>{activeTab}</Text> */}
                            {activeTab === tabs[0] && (
                              <Box>
                                {userPosts.length > 0 ? (
                                  <Box>
                                    <PostItem post={userPosts[0]} profile />
                                    <Box alignItems="center" marginTop="l">
                                      <TouchableOpacity
                                        onPress={() =>
                                          mainNavigation.navigate('UserPosts', {
                                            posts: userPosts,
                                          })
                                        }>
                                        <Text fontSize={16} variant="semibold">
                                          See all
                                        </Text>
                                      </TouchableOpacity>
                                    </Box>
                                  </Box>
                                ) : (
                                  <EmptyState subtitle="No posts added yet" />
                                )}
                              </Box>
                            )}
                            {activeTab === tabs[1] && (
                              <Box>
                                <ServicesCarousel
                                  consultationTime={consultationTime}
                                  userConsultancy={[]}
                                  pricingData={
                                    pricingData || examplePricingData
                                  }
                                />
                              </Box>
                            )}
                          </Box>
                        </Animated.View>
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Introduction Video
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>
                        {user?.videoIntro ? (
                          <Box>
                            <Box
                              marginTop="m"
                              height={232}
                              borderRadius={8}
                              overflow="hidden">
                              <Video
                                paused={paused}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                }}
                                source={{
                                  uri: user?.videoIntro,
                                }}
                                controls
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box paddingBottom="m">
                            <EmptyState subtitle="This user does not have an introduction video" />
                          </Box>
                        )}
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Contact
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>
                        <Box gap="mid" marginTop="m">
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              Email Address
                            </Text>
                            <Text color="label">{user?.email}</Text>
                          </Box>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              Phone Number
                            </Text>
                            <Text color="label">{user?.mobileNumber}</Text>
                          </Box>
                          <Box gap="xs">
                            <Text variant="semibold" fontSize={16}>
                              Personal Website
                            </Text>
                            <Text color="label">{user?.websiteAddress}</Text>
                          </Box>
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Skills
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>
                        <Box gap="mid" marginTop="m">
                          {skills.length > 0 ? (
                            <>
                              {skills.map(s => (
                                <Box key={s.id}>
                                  <Box gap="xs">
                                    <Text variant="semibold" fontSize={16}>
                                      {s.name}
                                    </Text>
                                    <Text color="label">
                                      {s.skills.join(', ')}
                                    </Text>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          ) : (
                            <Box paddingBottom="m">
                              <EmptyState subtitle="This user does not have any skill added" />
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Education
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>
                        <Box gap="mid" marginTop="m">
                          {education.length > 0 ? (
                            <>
                              {education.map(s => (
                                <Box key={s.id}>
                                  <Box gap="xs">
                                    <Text variant="semibold" fontSize={16}>
                                      {s.school_name}
                                    </Text>
                                    <Text>
                                      {s.degree} {s.field_of_study}
                                    </Text>
                                    <Text color="label">
                                      {s.start_month} {s.start_year} -{' '}
                                      {s?.isCurrent
                                        ? 'Present'
                                        : `${s.start_month} ${s.start_year}`}{' '}
                                    </Text>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          ) : (
                            <Box paddingBottom="m">
                              <EmptyState subtitle="This user does not have any education added" />
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Experience
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>

                        <Box gap="mid" marginTop="m">
                          {experience.length > 0 ? (
                            <>
                              {experience.map(s => (
                                <Box key={s.id}>
                                  <Box gap="xs">
                                    <Text variant="semibold" fontSize={16}>
                                      {s.company_name}
                                    </Text>
                                    <Text>{s.title}</Text>
                                    <Text color="label">
                                      {s.start_month} {s.start_year} -{' '}
                                      {s?.isCurrent
                                        ? 'Present'
                                        : `${s.start_month} ${s.start_year}`}{' '}
                                    </Text>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          ) : (
                            <Box paddingBottom="m">
                              <EmptyState subtitle="This user does not have any experience added" />
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Box flex={1}>
                            <Text variant="semibold" fontSize={18}>
                              Languages
                            </Text>
                          </Box>
                          <Box></Box>
                        </Box>
                        <Box gap="mid" marginTop="m">
                          {languages.length > 0 ? (
                            <>
                              {languages.map(s => (
                                <Box key={s.id}>
                                  <Box gap="xs">
                                    <Text variant="semibold" fontSize={16}>
                                      {s.language}
                                    </Text>
                                    <Text color="label">{s.proficiency}</Text>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          ) : (
                            <Box paddingBottom="m">
                              <EmptyState subtitle="This user does not have any language added" />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box></Box>
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default ViewProfileScreen;
