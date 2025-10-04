import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/Tabs/HomeScreen';
import { BottomTabList } from '@/utils/ParamList';
import ConsultantScreen from '@/screens/Tabs/ConsultantScreen';
import MessageScreen from '@/screens/Tabs/MessageScreen';
import ProfileScreen from '@/screens/Tabs/ProfileScreen';
import CommunitiesScreen from '@/screens/Tabs/CommunitiesScreen';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import FontelloCocoIconOutline from '@/utils/custom-fonts/FontelloCocoIconOutline';
import { useThemeColors } from '@/hooks/useTheme';
import BottomTabBar from '@/components/BottomTabBar';

const Tab = createBottomTabNavigator<BottomTabList>();

const BottomTab = () => {
  const { button_primary } = useThemeColors();

  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // animation: 'shift',
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontelloCocoIcon name="home" size={20} color={button_primary} />
            ) : (
              <FontelloCocoIconOutline
                name="home"
                size={20}
                color={button_primary}
              />
            ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Consultant"
        component={ConsultantScreen}
        options={{
          tabBarIcon: ({}) => (
            <FontelloCocoIcon
              name="headphone"
              size={20}
              color={button_primary}
            />
          ),
          title: 'Consultation',
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontelloCocoIcon
                name="message-5"
                size={20}
                color={button_primary}
              />
            ) : (
              <FontelloCocoIconOutline
                name="message-5"
                size={20}
                color={button_primary}
              />
            ),
          title: 'Messages',
        }}
      />
      <Tab.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontelloCocoIcon
                name="two-user"
                size={20}
                color={button_primary}
              />
            ) : (
              <FontelloCocoIconOutline
                name="two-user"
                size={20}
                color={button_primary}
              />
            ),
          title: 'Groups',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontelloCocoIcon name="user" size={20} color={button_primary} />
            ) : (
              <FontelloCocoIconOutline
                name="user"
                size={20}
                color={button_primary}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
