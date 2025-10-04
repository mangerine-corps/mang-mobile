import {
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
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import {
  useCreateWorkMutation,
  useUpdateWorkMutation,
} from '@/state/services/work.service';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { useLoadPosts } from '@/state/hooks/loadposts.hook';
import FastImage from 'react-native-fast-image';

const schema = yup
  .object({
    title: yup.string().max(255).required('Title is required'),
    description: yup.string().max(255),
    link: yup.string().max(255).url('Enter a valid url'),
  })
  .required();

const AddWorkScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'AddWork'>) => {
  const { foreground, foreground_primary } = useThemeColors();
  const [createWork, { isLoading }] = useCreateWorkMutation();
  const { loadUserWorks } = useLoadPosts();
  const [editWork, { isLoading: editLoading }] = useUpdateWorkMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      title: route?.params?.work?.title || '',
      description: route?.params?.work?.description || '',
      link: route?.params?.work?.link || route?.params?.url || '',
    },
    resolver: yupResolver(schema),
  });
  const [assets, setAssets] = useState<Asset[]>([]);

  const selectPic = async () => {
    const pick = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.4,
    });
    if (!pick?.assets) {
      return;
    }
    setAssets(pick?.assets);
  };

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const { title, description, link } = cred;

        if ((!title || assets.length < 1) && !route.params?.work) {
          showMessage({
            message:
              'Kindly fill all required fields and select an image to proceed',
            type: 'danger',
          });
          return;
        }

        const body = new FormData();
        body.append('title', title);
        body.append('link', link);
        body.append('description', description);
        if (assets?.length) {
          body.append('file', {
            uri: assets[0]?.uri!.replace(
              Platform.OS === 'ios' ? 'file://' : '',
              '',
            ),
            name: assets[0].fileName!,
            type: assets[0].type!,
          });
        }
        const response = await (!route?.params?.work
          ? createWork({
              body,
            })
          : editWork({
              body,
              id: route?.params?.work?.id,
            }));
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
        showMessage({
          message: 'Profile updated',
          type: 'success',
        });
        loadUserWorks();
        navigation?.goBack();
      } catch (error) {
        console.log('wwork error:', error);
      }
    },
    [assets, createWork, navigation, loadUserWorks, editWork, route],
  );

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
                      {route?.params?.work ? 'Edit' : 'Add'} Work
                    </Text>
                  </Box>
                  <Box padding="s" opacity={0}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={24}
                      color={foreground}
                    />
                  </Box>
                </Box>
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box paddingHorizontal="l">
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="title"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.title?.message}
                              label="Title"
                              value={value}
                              required
                              onChangeText={onChange}
                              placeholder="Project Title"
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="link"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.link?.message}
                              label="Link"
                              value={value}
                              onChangeText={onChange}
                              placeholder="Link to project"
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="description"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.description?.message}
                              label="Description"
                              value={value}
                              verticalAlign="top"
                              height={120}
                              multiline
                              onChangeText={onChange}
                              placeholder="Tell us about the project"
                            />
                          )}
                        />
                      </Box>
                      <Box marginBottom="xl">
                        <TouchableOpacity onPress={selectPic}>
                          <Box
                            height={220}
                            backgroundColor="searchbg"
                            overflow="hidden"
                            position="relative"
                            borderRadius={8}
                            justifyContent="center"
                            alignItems="center">
                            <MaterialCommunityIcons
                              name="image"
                              size={80}
                              color={foreground_primary}
                            />
                            {(assets.length > 0 ||
                              route?.params?.work?.file) && (
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                overflow="hidden">
                                <FastImage
                                  source={{
                                    uri:
                                      assets[0]?.uri ||
                                      route?.params?.work?.file,
                                  }}
                                  style={{ height: '100%', width: '100%' }}
                                />
                              </Box>
                            )}
                          </Box>
                        </TouchableOpacity>
                      </Box>
                      <Box>
                        <Button
                          loading={isLoading || editLoading}
                          onPress={handleSubmit(proceed)}
                          displayText="Save"
                        />
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default AddWorkScreen;
