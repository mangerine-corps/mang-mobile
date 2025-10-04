import { Animated, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { addAlpha } from '@/utils/helpers';

const MyBusinessScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'MyBusiness'>) => {
  const { foreground, label } = useThemeColors();
  const [activeSublinks, setActiveSublinks] = useState('');

  const items = [
    {
      title: 'My Dashboard',
      color: addAlpha('#30BC0D', 0.1),
      icon: <FontelloCocoIcon name="menu" size={24} color="#30BC0D" />,
      onPress: () => {
        navigation.navigate('Dashboard');
      },
      subLinks: [],
    },
    {
      title: 'My Meeting',
      color: addAlpha('#363853', 0.1),
      icon: <FontelloCocoIcon name="folder" size={24} color="#363853" />,
      onPress: () => {
        // navigation.navigate('AccountSettings');
      },
      subLinks: [
        {
          title: 'Availability Settings',
          onPress: () => {
            navigation.navigate('AvailabilitySettings');
          },
        },
        {
          title: 'Meeting Preference',
          onPress: () => {
            navigation.navigate('MeetingPreference');
          },
        },
        {
          title: 'Pricing',
          onPress: () => {
            navigation.navigate('Pricing');
          },
        },
        {
          title: 'Calendar view',
          onPress: () => {
            navigation.navigate('CalendarView');
          },
        },
        {
          title: 'Upcoming Appointments',
          onPress: () => {
            navigation.navigate('AccountSettings');
          },
        },
        {
          title: 'Consultation History',
          onPress: () => {
            navigation.navigate('AccountSettings');
          },
        },
      ],
    },
    // {
    //   title: 'My Wallet',
    //   color: addAlpha('#F71AFC', 0.1),
    //   icon: <FontelloCocoIcon name="wallet" size={24} color="#F71AFC" />,
    //   onPress: () => {
    //     navigation.navigate('AccountSettings');
    //   },
    //   subLinks: [],
    // },
    // {
    //   title: 'My Account',
    //   color: addAlpha('#2733DA', 0.1),
    //   icon: <FontelloCocoIcon name="user" size={24} color="#2733DA" />,
    //   onPress: () => {
    //     navigation.navigate('AccountSettings');
    //   },
    //   subLinks: [],
    // },
  ];

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
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
                  My Business
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1} paddingTop="l">
              <ScrollView showsVerticalScrollIndicator={false}>
                {items.map(i => (
                  <Box key={i.title}>
                    <TouchableOpacity
                      onPress={() => {
                        if (i.subLinks.length) {
                          if (activeSublinks === i.title) {
                            setActiveSublinks('');
                          } else {
                            setActiveSublinks(i.title);
                          }
                        } else {
                          i.onPress();
                        }
                      }}>
                      <Box
                        paddingHorizontal="l"
                        flexDirection="row"
                        alignItems="center"
                        gap="mid"
                        paddingVertical="mid"
                        borderBottomWidth={1}
                        borderBottomColor="searchbg">
                        <Box
                          height={40}
                          width={40}
                          borderRadius={40}
                          justifyContent="center"
                          alignItems="center"
                          style={{ backgroundColor: i.color }}>
                          {i.icon}
                        </Box>
                        <Box flex={1}>
                          <Text color="label" fontSize={16}>
                            {i.title}
                          </Text>
                        </Box>
                        <MaterialCommunityIcons
                          name={
                            activeSublinks === i.title
                              ? 'chevron-down'
                              : 'chevron-right'
                          }
                          size={24}
                          color={label}
                        />
                      </Box>
                    </TouchableOpacity>
                    <Box
                      marginLeft="xl"
                      borderLeftWidth={1}
                      borderLeftColor="label">
                      <Animated.View
                        style={{
                          maxHeight: activeSublinks === i.title ? 500 : 0,
                          overflow: 'hidden',
                        }}>
                        <Box>
                          {i.subLinks.map(s => (
                            <TouchableOpacity
                              key={s.title}
                              onPress={() => {
                                s.onPress();
                              }}>
                              <Box
                                flexDirection="row"
                                alignItems="center"
                                marginVertical="mid">
                                <Box
                                  width={25}
                                  marginRight="l"
                                  borderBottomWidth={1}
                                  borderBottomColor="label"
                                />
                                <Text color="label" fontSize={16}>
                                  {s.title}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          ))}
                        </Box>
                      </Animated.View>
                    </Box>
                  </Box>
                ))}
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default MyBusinessScreen;
