import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { addAlpha } from '@/utils/helpers';

const SettingsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'Settings'>) => {
  const { foreground, label } = useThemeColors();

  const items = [
    {
      title: 'Account Setting',
      color: '#36385314',
      icon: <FontelloCocoIcon name="user" size={24} color="#363853" />,
      onPress: () => {
        navigation.navigate('AccountSettings');
      },
    },
    {
      title: 'Privacy Setting',
      color: '#FC731A14',
      icon: <FontelloCocoIcon name="lock" size={24} color="#FC731A" />,
      onPress: () => {
        navigation.navigate('PrivacySettings');
      },
    },
    {
      title: 'Notification Setting',
      color: '#0DBC9D14',
      icon: (
        <FontelloCocoIcon name="notification-1" size={24} color="#0DBC9D" />
      ),
      onPress: () => {
        navigation.navigate('NotificationSettings');
      },
    },
    {
      title: 'Payment Setting',
      color: '#F71AFC14',
      icon: <FontelloCocoIcon name="card" size={24} color="#F71AFC" />,
      onPress: () => {
        navigation.navigate('PaymentSettings');
      },
    },
    {
      title: 'Security Setting',
      color: addAlpha('#181923', 8 / 100),
      icon: <FontelloCocoIcon name="shield" size={24} color="#181923" />,
      onPress: () => {
        navigation.navigate('SecuritySettings');
      },
    },
    {
      title: 'General Setting',
      color: addAlpha('#FCD81A', 8 / 100),
      icon: <FontelloCocoIcon name="setting" size={24} color="#FCD81A" />,
      onPress: () => {
        navigation.navigate('GeneralSettings');
      },
    },
    {
      title: 'Help & Support',
      color: addAlpha('#1976D2', 8 / 100),
      icon: <FontelloCocoIcon name="info" size={24} color="#1976D2" />,
      onPress: () => {
        navigation.navigate('HelpAndSupport');
      },
    },
    {
      title: 'Legal Setting ',
      color: addAlpha('#30BC0D', 8 / 100),
      icon: <FontelloCocoIcon name="document" size={24} color="#30BC0D" />,
      onPress: () => {
        // navigation.navigate('AccountSettings');
      },
    },
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
                  Settings
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1} paddingTop="l">
              <ScrollView showsVerticalScrollIndicator={false}>
                {items.map(i => (
                  <TouchableOpacity onPress={i.onPress} key={i.title}>
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
                        name="chevron-right"
                        size={24}
                        color={label}
                      />
                    </Box>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default SettingsScreen;
