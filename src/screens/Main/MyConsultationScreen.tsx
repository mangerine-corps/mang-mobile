import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem } from 'react-native-material-menu';
import FontelloCocoIconOutline from '@/utils/custom-fonts/FontelloCocoIconOutline';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';

const MyConsultationScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'MyConsultation'>) => {
  const { foreground, label, primary_background } = useThemeColors();
  const mainTabs = [
    'Consultation History',
    'Payment History',
    'Consultation Videos',
  ];
  const [activeTab, setActiveTab] = useState(mainTabs[0]);
  const [maxNameWidth, setMaxNameWidth] = useState<number | undefined>(
    undefined,
  );
  const [menuVisible, setMenuVisible] = useState(false);

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
                  My Consultation
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap="s">
                {mainTabs.map(t => (
                  <Box flex={1} key={t}>
                    <TouchableOpacity onPress={() => setActiveTab(t)}>
                      <Box
                        height={48}
                        borderBottomWidth={1}
                        borderBottomColor={
                          activeTab === t ? 'foreground_primary' : 'transparent'
                        }
                        justifyContent="center"
                        alignItems="center">
                        <Text
                          textAlign="center"
                          fontSize={12}
                          color={
                            activeTab === t ? 'foreground_primary' : 'label'
                          }
                          variant={activeTab === t ? 'semibold' : 'regular'}>
                          {t}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                ))}
              </Box>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box>
                    {activeTab === mainTabs[0] && (
                      <Box paddingHorizontal="l" marginVertical="m">
                        <Box
                          backgroundColor="primary_background"
                          borderRadius={8}>
                          <Box
                            paddingBottom="l"
                            borderBottomWidth={1}
                            borderBottomColor="faded_border"
                            flexDirection="row"
                            gap="l"
                            paddingHorizontal="l"
                            marginTop="m">
                            <Box
                              onLayout={e =>
                                setMaxNameWidth(e.nativeEvent.layout.width)
                              }>
                              <Text
                                variant="semibold"
                                textTransform="uppercase"
                                fontSize={10}>
                                Consultant Name
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                variant="semibold"
                                textTransform="uppercase"
                                fontSize={10}>
                                DATE & TIME
                              </Text>
                            </Box>
                          </Box>
                          <Box paddingBottom="l">
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              paddingVertical="mid"
                              gap="l"
                              paddingHorizontal="l">
                              <Box maxWidth={maxNameWidth}>
                                <Text numberOfLines={1}>Ralph Edwards</Text>
                                <Text
                                  numberOfLines={1}
                                  fontSize={10}
                                  color="foreground_primary"
                                  opacity={0.5}>
                                  President of Sales
                                </Text>
                              </Box>
                              <Box
                                flex={1}
                                flexDirection="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="l">
                                <Box>
                                  <Text>23 Jan, 2024 | 2:22pm</Text>
                                </Box>
                                <Box>
                                  <Menu
                                    style={{
                                      backgroundColor: primary_background,
                                    }}
                                    visible={menuVisible}
                                    anchor={
                                      <TouchableOpacity
                                        onPress={() => setMenuVisible(true)}>
                                        <Box
                                          height={40}
                                          width={40}
                                          borderWidth={2}
                                          borderRadius={4}
                                          borderColor="faded_border"
                                          justifyContent="center"
                                          alignItems="center">
                                          <MaterialCommunityIcons
                                            name="dots-vertical"
                                            size={24}
                                            color={foreground}
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
                                        <FontelloCocoIconOutline
                                          name="video"
                                          size={18}
                                          color={label}
                                        />
                                        <Text fontSize={16}>Watch Video</Text>
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
                                        <FontelloCocoIcon
                                          name="star"
                                          size={18}
                                          color={label}
                                        />
                                        <Text fontSize={16}>
                                          Rate Consultant
                                        </Text>
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
                                        <FontelloCocoIcon
                                          name="eye"
                                          size={18}
                                          color={label}
                                        />
                                        <Text fontSize={16}>
                                          View Payment Receipt
                                        </Text>
                                      </Box>
                                    </MenuItem>
                                  </Menu>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {activeTab === mainTabs[1] && (
                      <Box paddingHorizontal="l" marginVertical="m">
                        <Box
                          backgroundColor="primary_background"
                          borderRadius={8}>
                          <Box
                            paddingBottom="l"
                            borderBottomWidth={1}
                            borderBottomColor="faded_border"
                            flexDirection="row"
                            gap="l"
                            paddingHorizontal="l"
                            marginTop="m">
                            <Box>
                              <Text
                                variant="semibold"
                                textTransform="uppercase"
                                fontSize={10}>
                                TOPIC
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                variant="semibold"
                                textTransform="uppercase"
                                fontSize={10}>
                                DATE & TIME
                              </Text>
                            </Box>
                          </Box>
                          <Box paddingBottom="l">
                            <Box
                              flexDirection="row"
                              alignItems="center"
                              paddingVertical="mid"
                              gap="l"
                              paddingHorizontal="l">
                              <Box maxWidth={120}>
                                <Text numberOfLines={1}>Resume Building</Text>
                              </Box>
                              <Box
                                flex={1}
                                flexDirection="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="l">
                                <Box>
                                  <Text>23 Jan, 2024 | 2:22pm</Text>
                                </Box>
                                <Box>
                                  <Menu
                                    style={{
                                      backgroundColor: primary_background,
                                    }}
                                    visible={menuVisible}
                                    anchor={
                                      <TouchableOpacity
                                        onPress={() => setMenuVisible(true)}>
                                        <Box
                                          height={40}
                                          width={40}
                                          borderWidth={2}
                                          borderRadius={4}
                                          borderColor="faded_border"
                                          justifyContent="center"
                                          alignItems="center">
                                          <MaterialCommunityIcons
                                            name="dots-vertical"
                                            size={24}
                                            color={foreground}
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
                                        <FontelloCocoIcon
                                          name="eye"
                                          size={18}
                                          color={label}
                                        />
                                        <Text fontSize={16}>
                                          View Payment Receipt
                                        </Text>
                                      </Box>
                                    </MenuItem>
                                  </Menu>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </ScrollView>
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default MyConsultationScreen;
