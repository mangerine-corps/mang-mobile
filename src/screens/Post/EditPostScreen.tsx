import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import Box from '@/components/Box';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import Text from '@/components/Text';
import { useAuth } from '@/state/hooks/user.hook';
import Select from '@/components/Select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import { useCreatePostMutation } from '@/state/services/posts.service';
import Image from 'react-native-fast-image';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { openPicker, Image as CropImage } from 'react-native-image-crop-picker';
import { addAlpha } from '@/utils/helpers';

const EditPostScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'EditPost'>) => {
  const { user } = useAuth();
  const [visibilty, setVisibilty] = useState('Everyone');
  const { foreground_primary, placeholder, foreground } = useThemeColors();
  const { regular } = useThemeText();
  const [create, { isLoading }] = useCreatePostMutation();
  const [avatar, setAvatar] = useState<CropImage[]>([]);
  const [content, setContent] = useState('');
  const { post: prePost } = route.params;
  const post = prePost;
  post;

  const selectAvatar = async () => {
    const pick = await openPicker({
      mediaType: 'photo',
      quality: 0.4,
      multiple: true,
      cropping: true,
      freeStyleCropEnabled: true,
      maxFiles: 2 - avatar.length,
    });
    if (pick.length > 0) {
      if (pick?.length > 2 - avatar.length) {
        showMessage({
          message: 'Only 2 images can be uploaded',
          type: 'none',
        });
      }
      setAvatar(pick.slice(0, 2 - avatar.length));
    }
  };

  const createPost = useCallback(async () => {
    try {
      if (avatar.length < 1 && !content.trim()) {
        return;
      }
      const body = new FormData();
      body.append('content', content.trim());
      avatar.forEach(image => {
        body.append('image[]', {
          uri: image.path!.replace(Platform.OS === 'ios' ? 'file://' : '', ''),
          name: image.filename!,
          type: image.mime!,
        });
      });
      const response = await create({
        body,
      });
      // console.log('createPost response:', JSON.stringify(response));
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
        message: 'Post created',
        type: 'success',
      });
      navigation.pop();
    } catch (error) {
      console.log('create post error:', error);
    }
  }, [avatar, content, create, navigation]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1}>
                <Box
                  paddingHorizontal="l"
                  paddingVertical="mid"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Box>
                    <TouchableOpacity onPress={navigation.goBack}>
                      <Text color="label">Cancel</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box>
                    <Text variant="semibold" fontSize={20} textAlign="center">
                      Create Post
                    </Text>
                  </Box>
                  <Box minHeight={40} minWidth={60} justifyContent="center">
                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    ) : (
                      <TouchableOpacity onPress={createPost}>
                        <Box
                          paddingVertical="s"
                          paddingHorizontal="m"
                          borderRadius={8}
                          backgroundColor="foreground_primary">
                          <Text color="background" variant="semibold">
                            Post
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    )}
                  </Box>
                </Box>
                <Box
                  marginBottom="mid"
                  paddingHorizontal="l"
                  paddingVertical="mid"
                  flexDirection="row"
                  gap="l"
                  alignItems="center">
                  <Box>
                    <Box
                      width={50}
                      height={50}
                      borderRadius={50}
                      overflow="hidden">
                      <Image
                        resizeMode="cover"
                        style={{ height: '100%', width: '100%' }}
                        source={{
                          uri: user?.profilePics as string,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Box width={120}>
                      <Select
                        height={40}
                        noMargin
                        title={visibilty}
                        value={visibilty}
                        onSelect={setVisibilty}
                        data={[
                          {
                            title: 'Everyone',
                            value: 'Everyone',
                          },
                          {
                            title: 'Followers',
                            value: 'Followers',
                          },
                        ]}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box flex={1}>
                  <Box flex={1} gap="mid">
                    <Box flex={2} paddingHorizontal="l">
                      <TextInput
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                        multiline
                        style={{
                          flex: 1,
                          fontFamily: regular.fontFamily,
                          lineHeight: 24,
                          color: foreground,
                        }}
                        placeholderTextColor={placeholder}
                        placeholder="What would you like to share?"
                      />
                    </Box>
                    {avatar.length > 0 && (
                      <Box
                        flex={1}
                        flexDirection="row"
                        gap="mid"
                        paddingHorizontal="l">
                        {avatar.map((a, index) => (
                          <Box
                            key={a.path}
                            height={200}
                            borderRadius={12}
                            overflow="hidden"
                            position="relative"
                            flex={1}>
                            <Image
                              source={{ uri: a.path }}
                              resizeMode="cover"
                              style={{ height: '100%', width: '100%' }}
                            />
                            <Box
                              position="absolute"
                              top={0}
                              left={0}
                              width="100%"
                              paddingHorizontal="s"
                              paddingTop="m"
                              flexDirection="row"
                              alignItems="center"
                              gap="l"
                              justifyContent="space-between">
                              <Box></Box>
                              <Box>
                                <TouchableOpacity
                                  onPress={() => {
                                    setAvatar(
                                      avatar.filter((_, i) => i !== index),
                                    );
                                  }}>
                                  <Box
                                    style={{
                                      backgroundColor: addAlpha('#000000', 0.4),
                                    }}
                                    height={40}
                                    width={40}
                                    borderRadius={4}
                                    justifyContent="center"
                                    alignItems="center">
                                    <Ionicons
                                      name="close"
                                      size={18}
                                      color="#FFFFFF"
                                    />
                                  </Box>
                                </TouchableOpacity>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box
                    paddingVertical="mid"
                    flexDirection="row"
                    justifyContent="flex-end"
                    paddingHorizontal="l">
                    <Box opacity={avatar.length === 2 ? 0.5 : undefined}>
                      <TouchableOpacity
                        onPress={selectAvatar}
                        disabled={avatar.length === 2}>
                        <Ionicons
                          name="images-outline"
                          size={24}
                          color={foreground_primary}
                        />
                      </TouchableOpacity>
                    </Box>
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

export default EditPostScreen;
