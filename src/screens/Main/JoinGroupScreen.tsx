import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import Button from '@/components/Button';
import { useJoinLeaveCommunityMutation } from '@/state/services/community.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import { useLoadGroups } from '@/state/hooks/loadgroups.hook';
import FastImage from 'react-native-fast-image';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import CheckBox from '@/components/CheckBox';

const JoinGroupScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'JoinGroup'>) => {
  const { foreground, label } = useThemeColors();
  const { regular } = useThemeText();
  const [joinGroup, { isLoading }] = useJoinLeaveCommunityMutation();
  const [preview, setPreview] = useState(false);
  const [agree, setAgree] = useState(false);
  const { loadJoinedGroups } = useLoadGroups();
  const { group } = route?.params;
  const systemFonts = [...defaultSystemFonts, regular.fontFamily];

  const submit = useCallback(async () => {
    try {
      if (!agree) {
        return;
      }
      const response = await joinGroup({
        id: group?.id,
      });
      // console.log('response', JSON.stringify(response));
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
      loadJoinedGroups();
      navigation.replace('ViewGroup', {
        group,
      });
    } catch (error) {
      console.log('group error:', error);
    }
  }, [agree, joinGroup, group, loadJoinedGroups, navigation]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={15}
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
                      onPress={() => {
                        if (preview) {
                          setPreview(false);
                          return;
                        }
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
                      Join our Group
                    </Text>
                  </Box>
                  <Box padding="s" width={32} opacity={0}></Box>
                </Box>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box
                      onStartShouldSetResponder={() => true}
                      paddingVertical="l"
                      paddingHorizontal="l">
                      <Box
                        padding="m"
                        borderRadius={8}
                        marginBottom="l"
                        gap="m"
                        backgroundColor="primary_background"
                        flexDirection="row">
                        <Box
                          height={64}
                          width={64}
                          borderRadius={8}
                          overflow="hidden">
                          <FastImage
                            source={{
                              uri: group?.image,
                            }}
                            style={{
                              height: '100%',
                              width: '100%',
                            }}
                          />
                        </Box>
                        <Box>
                          <Text fontSize={16} variant="semibold">
                            {group?.name}
                          </Text>
                          <Text numberOfLines={2}>{group?.description}</Text>
                        </Box>
                      </Box>
                      <Box marginBottom="s">
                        <Text variant="semibold" fontSize={16}>
                          {group?.name}
                        </Text>
                        <Text fontSize={16}>{group?.category}</Text>
                        <Text marginTop="s">{group?.description}</Text>
                      </Box>
                      <Box flexDirection="row" gap="s" alignItems="center">
                        <Feather name="globe" size={24} color={label} />
                        <Text
                          variant="medium"
                          fontSize={16}
                          color="label"
                          textTransform="capitalize">
                          {group?.isPrivate ? 'Private' : 'Public'}
                        </Text>
                      </Box>
                      <Box marginTop="l">
                        <Text
                          marginBottom="mid"
                          fontSize={16}
                          variant="semibold">
                          Our Rules and Regulations
                        </Text>
                        <Box>
                          <RenderHtml
                            contentWidth={Dimensions.get('window').width - 48}
                            source={{
                              html: group?.rules || '',
                            }}
                            systemFonts={systemFonts}
                            baseStyle={{
                              fontFamily: regular.fontFamily,
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        marginTop="l"
                        flexDirection="row"
                        gap="s"
                        alignItems="flex-start">
                        <Box>
                          <CheckBox
                            size={16}
                            checked={agree}
                            onPress={() => setAgree(!agree)}
                          />
                        </Box>
                        <Box flex={1}>
                          <Text variant="semibold">
                            I agree to the Virtual Assistant Community rules and
                            guidelines.
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
                <Box
                  gap="m"
                  paddingHorizontal="l"
                  paddingBottom="xl"
                  paddingTop="l">
                  <Box>
                    <Button
                      disabled={!agree}
                      loading={isLoading}
                      displayText="Submit"
                      onPress={submit}
                    />
                  </Box>
                  <Box>
                    <Button
                      buttonProps={{
                        backgroundColor: 'background',
                        borderWidth: 1,
                        borderColor: 'button_primary',
                      }}
                      onPress={navigation.goBack}
                      textProps={{
                        color: 'button_primary',
                      }}
                      displayText="Cancel"
                    />
                  </Box>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default JoinGroupScreen;
