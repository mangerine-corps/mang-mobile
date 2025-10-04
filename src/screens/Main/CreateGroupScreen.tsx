import {
  Image,
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
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Select from '@/components/Select';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import {
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
} from '@/state/services/community.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import { useLoadGroups } from '@/state/hooks/loadgroups.hook';
import { useAuth } from '@/state/hooks/user.hook';

const schema = yup
  .object({
    name: yup.string().max(255).required('Name is required'),
    category: yup.string().max(255).required('Category is required'),
    description: yup.string().max(500).required('Description is required'),
    rules: yup.string().max(1000).required('Rules are required'),
    questionnaire: yup.string().max(1000),
  })
  .required();

const fieldsType = schema.getDefault();

type Fields = keyof typeof fieldsType;

type FieldKeys = {
  // eslint-disable-next-line no-unused-vars
  [key in Fields]: string;
};

const CreateGroupScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'CreateGroup'>) => {
  const { foreground, foreground_primary, faded, label } = useThemeColors();
  const [visibilty, setVisibilty] = useState(
    route?.params?.group
      ? route?.params?.group?.isPrivate
        ? 'private'
        : 'public'
      : 'public',
  );
  const [assets, setAssets] = useState<Asset[]>([]);
  const [fields, setFields] = useState<FieldKeys | undefined>(undefined);
  const [createGroup, { isLoading }] = useCreateCommunityMutation();
  const [editGroup, { isLoading: editLoading }] = useUpdateCommunityMutation();
  const [preview, setPreview] = useState(false);
  const { loadJoinedGroups } = useLoadGroups();
  const { interests = [] } = useAuth();

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      category: route?.params?.group?.category?.id || '',
      description: route?.params?.group?.description || '',
      name: route?.params?.group?.name || '',
      rules: route?.params?.group?.rules || '',
      questionnaire: route?.params?.group?.questionnaire || '',
    },
    resolver: yupResolver(schema),
  });

  const submit = useCallback(
    async (cred: any) => {
      try {
        if (!cred) {
          return;
        }

        const { category, description, name, questionnaire, rules } =
          cred as FieldKeys;
        if (!name || !category || !rules) {
          showMessage({
            message: 'Make sure to fill group name, category and rules',
            type: 'danger',
          });
          return;
        }
        if (!visibilty || assets.length < 1) {
          showMessage({
            message: 'Select a visibility and an image',
            type: 'danger',
          });
          return;
        }
        if (!preview) {
          setPreview(true);
          setFields(cred);
          return;
        }
        const body = new FormData();
        body.append('name', name);
        body.append('image', {
          uri: assets[0]?.uri!.replace(
            Platform.OS === 'ios' ? 'file://' : '',
            '',
          ),
          name: assets[0].fileName!,
          type: assets[0].type!,
        });
        body.append('description', description);
        body.append('category', category);
        body.append('questions', questionnaire);
        body.append('rules', rules);
        body.append('visibility', visibilty);
        body.append('isPrivate', visibilty === 'private');
        // console.log('body', body);
        const response = await createGroup({
          body,
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
        navigation.goBack();
      } catch (error) {
        console.log('group error:', error);
      }
    },
    [assets, createGroup, visibilty, preview, loadJoinedGroups, navigation],
  );

  const update = useCallback(
    async (cred: any) => {
      try {
        if (!cred) {
          return;
        }

        const { category, description, name, questionnaire, rules } =
          cred as FieldKeys;
        if (!name || !category || !rules) {
          showMessage({
            message: 'Make sure to fill group name, category and rules',
            type: 'danger',
          });
          return;
        }
        if (!route?.params?.group?.id) {
          return;
        }
        if (!visibilty) {
          showMessage({
            message: 'Select a visibility and an image',
            type: 'danger',
          });
          return;
        }
        if (!preview) {
          setPreview(true);
          setFields(cred);
          return;
        }
        const body = new FormData();
        body.append('name', name);
        if (assets?.length) {
          body.append('image', {
            uri: assets[0]?.uri!.replace(
              Platform.OS === 'ios' ? 'file://' : '',
              '',
            ),
            name: assets[0].fileName!,
            type: assets[0].type!,
          });
        }
        body.append('description', description);
        body.append('category', category);
        body.append('questions', questionnaire);
        body.append('rules', rules);
        body.append('visibility', visibilty);
        body.append('isPrivate', visibilty === 'private');
        // console.log('body', body);
        const response = await editGroup({
          body,
          id: route?.params?.group?.id,
        });
        console.log('response', JSON.stringify(response));
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
        navigation.goBack();
      } catch (error) {
        console.log('group update error:', error);
      }
    },
    [
      assets,
      editGroup,
      visibilty,
      preview,
      loadJoinedGroups,
      navigation,
      route,
    ],
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
                      {!preview
                        ? `${
                            route?.params?.group ? 'Edit' : 'Create'
                          } Your Group`
                        : 'Group Preview'}
                    </Text>
                  </Box>
                  <Box padding="s" width={32} opacity={0}></Box>
                </Box>
                {!preview && (
                  <Box paddingHorizontal="mxl" marginBottom="s">
                    <Text textAlign="center" color="label">
                      Bring people together around a shared interest.
                    </Text>
                  </Box>
                )}
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {!preview ? (
                      <Box
                        onStartShouldSetResponder={() => true}
                        paddingHorizontal="l">
                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                label="Community Name"
                                error={errors.name?.message}
                                borderColor="faded"
                                value={value}
                                placeholder="Enter community name"
                                onChangeText={onChange}
                                rightComponent={
                                  <Box>
                                    <MaterialCommunityIcons
                                      name="account-group"
                                      size={24}
                                      color={foreground_primary}
                                    />
                                  </Box>
                                }
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
                                label="Community Description (Optional)"
                                error={errors.description?.message}
                                borderColor="faded"
                                value={value}
                                height={120}
                                textAlignVertical="top"
                                verticalAlign="top"
                                multiline
                                placeholder="Describe the purpose of your community"
                                onChangeText={onChange}
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
                            name="category"
                            render={({ field: { onChange, value } }) => (
                              <Select
                                error={errors.category?.message}
                                title={fields?.category || 'Select a category'}
                                borderColor={faded}
                                data={interests.map(interest => ({
                                  title: interest.name,
                                  value: interest.id,
                                }))}
                                value={value}
                                required
                                onSelect={v => {
                                  onChange(v);
                                }}
                              />
                            )}
                          />
                        </Box>
                        <Box marginBottom="m">
                          <Text
                            fontSize={20}
                            variant="semibold"
                            marginBottom="m">
                            Group Privacy
                          </Text>
                          <Box gap="mid">
                            <TouchableOpacity
                              onPress={() => setVisibilty('public')}>
                              <Box>
                                <Box
                                  flexDirection="row"
                                  alignItems="center"
                                  justifyContent="space-between">
                                  <Text variant="semibold" fontSize={16}>
                                    Public Group
                                  </Text>
                                  <MaterialCommunityIcons
                                    name={
                                      visibilty === 'public'
                                        ? 'radiobox-marked'
                                        : 'radiobox-blank'
                                    }
                                    size={18}
                                    color={
                                      visibilty === 'public'
                                        ? foreground_primary
                                        : faded
                                    }
                                  />
                                </Box>
                                <Box marginTop="s">
                                  <Text fontSize={16}>
                                    Anyone can join and view the content. Ideal
                                    for open discussions and broad outreach.
                                  </Text>
                                </Box>
                              </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setVisibilty('private')}>
                              <Box>
                                <Box
                                  flexDirection="row"
                                  alignItems="center"
                                  justifyContent="space-between">
                                  <Text variant="semibold" fontSize={16}>
                                    Private Group
                                  </Text>
                                  <MaterialCommunityIcons
                                    name={
                                      visibilty === 'private'
                                        ? 'radiobox-marked'
                                        : 'radiobox-blank'
                                    }
                                    size={18}
                                    color={
                                      visibilty === 'private'
                                        ? foreground_primary
                                        : faded
                                    }
                                  />
                                </Box>
                                <Box marginTop="s">
                                  <Text fontSize={16}>
                                    Membership by invitation or request only.
                                    Suitable for focused or exclusive groups
                                  </Text>
                                </Box>
                              </Box>
                            </TouchableOpacity>
                          </Box>
                        </Box>

                        <Box>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            name="questionnaire"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                label="Ask questions to new members"
                                error={errors.questionnaire?.message}
                                borderColor="faded"
                                value={value}
                                placeholder="Why do you want to join this Group"
                                onChangeText={onChange}
                                rightComponent={
                                  <Box>
                                    <MaterialCommunityIcons
                                      name="account-group"
                                      size={24}
                                      color={foreground_primary}
                                    />
                                  </Box>
                                }
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
                            name="rules"
                            render={({ field: { onChange, value } }) => (
                              <Input
                                label="Group Rules"
                                error={errors.rules?.message}
                                borderColor="faded"
                                value={value}
                                height={120}
                                textAlignVertical="top"
                                verticalAlign="top"
                                multiline
                                placeholder="What rules is your Group guided by?"
                                onChangeText={onChange}
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
                                route?.params?.group?.image) && (
                                <Box
                                  position="absolute"
                                  top={0}
                                  left={0}
                                  width="100%"
                                  height="100%"
                                  overflow="hidden">
                                  <Image
                                    source={{
                                      uri:
                                        assets[0]?.uri ||
                                        route?.params?.group?.image,
                                    }}
                                    style={{ height: '100%', width: '100%' }}
                                  />
                                </Box>
                              )}
                            </Box>
                          </TouchableOpacity>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        onStartShouldSetResponder={() => true}
                        paddingVertical="l"
                        paddingHorizontal="l">
                        <Box
                          backgroundColor="faded"
                          height={202}
                          borderRadius={12}
                          overflow="hidden"
                          marginBottom="l">
                          <Image
                            source={{
                              uri:
                                assets[0]?.uri || route?.params?.group?.image,
                            }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </Box>
                        <Box marginBottom="s">
                          <Text variant="semibold" fontSize={16}>
                            {fields?.name}
                          </Text>
                          <Text fontSize={16}>
                            {
                              interests.find(
                                interest => interest.id === fields?.category,
                              )?.name
                            }
                          </Text>
                          <Text marginTop="s">{fields?.description}</Text>
                        </Box>
                        <Box flexDirection="row" gap="s" alignItems="center">
                          <Feather name="globe" size={24} color={label} />
                          <Text
                            variant="medium"
                            fontSize={16}
                            color="label"
                            textTransform="capitalize">
                            {visibilty}
                          </Text>
                        </Box>
                        <Box marginTop="l">
                          <Text
                            marginBottom="mid"
                            fontSize={16}
                            variant="semibold">
                            Our Rules and Regulations
                          </Text>
                          <Text>{fields?.rules}</Text>
                        </Box>
                      </Box>
                    )}
                  </ScrollView>
                </Box>
                <Box
                  gap="m"
                  paddingHorizontal="l"
                  paddingBottom="xl"
                  paddingTop="l">
                  <Box>
                    <Button
                      loading={isLoading || editLoading}
                      displayText={!preview ? 'Preview' : 'Done'}
                      onPress={handleSubmit(
                        route?.params?.group ? update : submit,
                      )}
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

export default CreateGroupScreen;
