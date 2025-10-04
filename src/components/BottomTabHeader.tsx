import { Animated, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import CocoIcon from '@/utils/custom-fonts/CocoIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from './Input';
import Text from './Text';
import Modal from './Modal';
import { addAlpha } from '@/utils/helpers';
import { useAuth } from '@/state/hooks/user.hook';
import { useDispatch } from 'react-redux';
import { signUserOut } from '@/state/reducers/user.reducer';
import Image from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabList, MainStack } from '@/utils/ParamList';
import moment from 'moment';
import MLogo from '@/assets/svgs/MLogo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  onSearch?: () => void;
  searchValue?: string;
  setSearchValue?: (v: string) => void;
}

const BottomTabHeader = ({ onSearch, searchValue, setSearchValue }: Props) => {
  const [maxWidth, setMaxWidth] = useState(0);
  const { label, foreground, danger } = useThemeColors();
  const [visible, setVisible] = useState(false);
  const [animatedWidth] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const bottomTabNavigation =
    useNavigation<BottomTabNavigationProp<BottomTabList, 'Home'>>();
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  const items = useMemo(
    () => [
      {
        title: 'Saved Items',
        icon: (
          <Ionicons name="bookmarks-outline" size={16} color={foreground} />
        ),
        onPress: () => {},
      },
      {
        title: 'Payments',
        icon: (
          <MaterialCommunityIcons name="cash" size={16} color={foreground} />
        ),
        onPress: () => {},
      },
      {
        title: 'Transaction History',
        icon: (
          <MaterialCommunityIcons name="cash" size={16} color={foreground} />
        ),
        onPress: () => {
          setShowMenu(false);
          setTimeout(() => {
            mainNavigation.navigate('MyConsultation');
          }, 900);
        },
      },
      {
        title: 'Earning Reports',
        icon: (
          <MaterialCommunityIcons name="cash" size={16} color={foreground} />
        ),
        onPress: () => {},
      },
    ],
    [foreground, mainNavigation],
  );

  const items2 = useMemo(
    () => [
      {
        title: 'Scheduled Consultantion',
        icon: (
          <Ionicons name="bookmarks-outline" size={16} color={foreground} />
        ),
        onPress: () => {
          setShowMenu(false);
          setTimeout(() => {
            mainNavigation.navigate('ScheduledConsultation');
          }, 900);
        },
      },
      {
        title: 'Favorite Consultants',
        icon: (
          <Ionicons name="bookmarks-outline" size={16} color={foreground} />
        ),
        onPress: () => {
          setShowMenu(false);
          setTimeout(() => {
            mainNavigation.navigate('FavouriteConsultants');
          }, 900);
        },
      },
    ],
    [foreground, mainNavigation],
  );

  const items3 = useMemo(
    () => [
      {
        title: 'My Business',
        icon: (
          <Ionicons name="bookmarks-outline" size={16} color={foreground} />
        ),
        onPress: () => {
          setShowMenu(false);
          setTimeout(() => {
            mainNavigation.navigate('MyBusiness');
          }, 900);
        },
      },
    ],
    [foreground, mainNavigation],
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(animatedWidth, {
        toValue: maxWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, animatedWidth, maxWidth]);

  useEffect(() => {
    if (!visible && setSearchValue) {
      setSearchValue('');
    }
  }, [visible, setSearchValue]);

  return (
    <Box>
      <Box
        flexDirection="row"
        paddingHorizontal="l"
        paddingVertical="mid"
        gap="s"
        alignItems="flex-start">
        <Box paddingTop="mid">
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <MLogo height={28} />
          </TouchableOpacity>
        </Box>
        <Box
          flex={1}
          borderColor="danger"
          flexDirection="row"
          position="relative"
          alignItems="center"
          justifyContent="flex-end"
          onLayout={e => setMaxWidth(e.nativeEvent.layout.width)}>
          {!visible && (
            <Box
              marginTop="mid"
              flexDirection="row"
              alignItems="center"
              gap="m">
              <Box flexDirection="row">
                <TouchableOpacity
                  onPress={() => {
                    if (onSearch) {
                      onSearch();
                      return;
                    }
                    setVisible(!visible);
                  }}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={30}
                    color={label}
                  />
                </TouchableOpacity>
              </Box>
              <Box>
                <TouchableOpacity>
                  <CocoIcon name="notification-2" size={30} color={label} />
                </TouchableOpacity>
              </Box>
            </Box>
          )}
          <Box position="absolute" top={0} right={0}>
            <Animated.View
              style={{
                width: animatedWidth,
                overflow: 'hidden',
              }}>
              <Box
                flexDirection="row"
                alignItems="center"
                gap="s"
                paddingTop="s">
                <Box
                  flexDirection="row"
                  alignItems="center"
                  flex={1}
                  backgroundColor="searchbg"
                  borderRadius={8}
                  paddingHorizontal="m">
                  <MaterialCommunityIcons
                    name="magnify"
                    size={30}
                    color={label}
                  />
                  <Box flex={1} justifyContent="center">
                    <Input
                      noMargin
                      backgroundColor="transparent"
                      borderWidth={0}
                      value={searchValue}
                      onChangeText={setSearchValue}
                    />
                  </Box>
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={30}
                      color={label}
                    />
                  </TouchableOpacity>
                </Box>

                <Box>
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Text color="button_primary" variant="medium">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Animated.View>
          </Box>
        </Box>
      </Box>
      <Box></Box>
      <Modal
        isVisible={showMenu}
        backdropColor={addAlpha('#000000', 0.2)}
        style={{ margin: 0 }}
        animationIn="fadeInLeft"
        animationOut="fadeOutLeft"
        onBackdropPress={() => setShowMenu(false)}
        onBackButtonPress={() => setShowMenu(false)}>
        <Box backgroundColor="background" width="75%" flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <Box flex={1} paddingVertical="l">
              <Box
                marginTop="30"
                flexDirection="row"
                alignItems="center"
                paddingHorizontal="l"
                marginBottom="l"
                justifyContent="space-between">
                <TouchableOpacity>
                  <Box
                    height={50}
                    borderWidth={1}
                    borderRadius={6}
                    width={50}
                    borderColor="minute_black"
                    justifyContent="center"
                    alignItems="center">
                    <MLogo height={24} />
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    setTimeout(() => {
                      mainNavigation.navigate('Settings');
                    }, 900);
                  }}>
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color={foreground}
                  />
                </TouchableOpacity>
              </Box>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box paddingBottom="l" paddingHorizontal="m">
                    <Box
                      borderWidth={1}
                      overflow="hidden"
                      paddingBottom="l"
                      borderColor="faded_border"
                      borderRadius={8}>
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
                      </Box>
                      <Box>
                        <Box marginHorizontal="l" style={{ marginTop: -30 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowMenu(false);
                              bottomTabNavigation.navigate('Profile');
                            }}>
                            <Box
                              height={73}
                              borderRadius={50}
                              width={57}
                              overflow="hidden"
                              backgroundColor="danger"
                              borderWidth={1}>
                              <Image
                                style={{ height: '100%', width: '100%' }}
                                resizeMode="cover"
                                source={{ uri: user?.profilePics || '' }}
                              />
                            </Box>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                      <Box marginTop="l">
                        <Box paddingHorizontal="m">
                          <Text variant="bold" fontSize={18}>
                            {user?.fullName}
                          </Text>
                          <Text>
                            {user?.title} | {user?.userType?.name}
                          </Text>
                        </Box>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          gap="m"
                          paddingHorizontal="m"
                          marginTop="mid">
                          <Box flexDirection="row" alignItems="center" gap="s">
                            <CocoIcon
                              name="location"
                              size={16}
                              color="#00A991"
                            />
                            <Text fontSize={10}>{user?.location}</Text>
                          </Box>
                          {user?.dateOfBirth && (
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              gap="s">
                              <CocoIcon name="user" size={16} color="#00A991" />
                              <Text fontSize={10}>
                                Born{' '}
                                {moment(user?.dateOfBirth).format('D MMMM')}
                              </Text>
                            </Box>
                          )}
                        </Box>
                        <Box marginTop="mid" paddingHorizontal="m">
                          <Text numberOfLines={5}>{user?.bio}</Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      marginTop="mid"
                      borderWidth={1}
                      overflow="hidden"
                      paddingVertical="l"
                      paddingHorizontal="m"
                      borderColor="faded_border"
                      borderRadius={8}>
                      <Box gap="mid">
                        {items.map(i => (
                          <TouchableOpacity onPress={i.onPress} key={i.title}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              gap="mid">
                              {i.icon}
                              <Text>{i.title}</Text>
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                    <Box
                      marginTop="mid"
                      borderWidth={1}
                      overflow="hidden"
                      paddingVertical="l"
                      paddingHorizontal="m"
                      borderColor="faded_border"
                      borderRadius={8}>
                      <Box gap="mid">
                        {items2.map(i => (
                          <TouchableOpacity onPress={i.onPress} key={i.title}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              gap="mid">
                              {i.icon}
                              <Text>{i.title}</Text>
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                    <Box
                      marginTop="mid"
                      borderWidth={1}
                      overflow="hidden"
                      paddingVertical="l"
                      paddingHorizontal="m"
                      borderColor="faded_border"
                      borderRadius={8}>
                      <Box gap="mid">
                        {items3.map(i => (
                          <TouchableOpacity onPress={i.onPress} key={i.title}>
                            <Box
                              alignItems="center"
                              flexDirection="row"
                              gap="mid">
                              {i.icon}
                              <Text>{i.title}</Text>
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
              <Box paddingHorizontal="xl" marginBottom="mxl">
                <TouchableOpacity
                  onPress={() => {
                    dispatch(signUserOut());
                  }}>
                  <Box flexDirection="row" alignItems="center">
                    <Ionicons name="exit-sharp" color={danger} size={24} />
                    <Text color="danger">Log out</Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </SafeAreaView>
        </Box>
      </Modal>
    </Box>
  );
};

export default BottomTabHeader;
