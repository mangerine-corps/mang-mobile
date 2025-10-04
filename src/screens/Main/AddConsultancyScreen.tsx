import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
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
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { useAddConsultancyMutation } from '@/state/services/users.service';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';

const schema = yup
  .object({
    title: yup.string().max(255).required('Title is required'),
    description: yup.string().max(255),
    hours: yup.string().max(255),
  })
  .required();

const AddConsultancyScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'AddConsultancy'>) => {
  const { foreground, foreground_primary } = useThemeColors();
  const { loadUserConsultancy } = useLoadAuth();
  const [addCon, { isLoading }] = useAddConsultancyMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      hours: '',
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
        const { title, description, hours } = cred;

        if (!title || !description || !hours || assets.length < 1) {
          showMessage({
            message: 'Kindly fill all fields to proceed',
            type: 'danger',
          });
          return;
        }

        const body = new FormData();
        body.append('title', title);
        body.append('hours', hours);
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
        const response = await addCon({
          body,
        });
        console.log('consultancy response', JSON.stringify(response));
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
        loadUserConsultancy();
        navigation?.goBack();
      } catch (error) {
        console.log('wwork error:', error);
      }
    },
    [assets, addCon, navigation, loadUserConsultancy],
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
                      Add Service
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
                              label="Service title"
                              value={value}
                              required
                              onChangeText={onChange}
                              placeholder="Service"
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
                          name="hours"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.hours?.message}
                              label="How many consulting hours"
                              value={value}
                              onChangeText={onChange}
                              placeholder="Hours"
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
                              label="Service description"
                              value={value}
                              verticalAlign="top"
                              height={120}
                              multiline
                              onChangeText={onChange}
                              placeholder="Description"
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
                            {assets.length > 0 && (
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                overflow="hidden">
                                <Image
                                  source={{
                                    uri: assets[0]?.uri,
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
                          loading={isLoading}
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

export default AddConsultancyScreen;
