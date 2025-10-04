import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { ErrorData, Language } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import EmptyState from '@/components/EmptyState';
import Select from '@/components/Select';
import {
  useAddLanguageMutation,
  useDeleteLanguageMutation,
} from '@/state/services/users.service';

const ManageLanguagesScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageLanguages'>) => {
  const { languages = [] } = useAuth();
  const { foreground, foreground_primary } = useThemeColors();
  const { loadUserLanguages, educationLoading } = useLoadAuth();
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const [editables, setEditables] = useState<Partial<Language>[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [addLanguage, { isLoading: createLoading }] = useAddLanguageMutation();
  const [deleteLanguage, { isLoading: deleteLoading }] =
    useDeleteLanguageMutation();

  const proceed = useCallback(
    async (id?: string) => {
      try {
        if (!id) {
        }
        const newEd = editables.find(e => e?.id === id);
        if (!newEd) {
          showMessage({
            message: 'Kindly fill all details to proceed',
            type: 'danger',
          });
          return;
        }

        const response = await addLanguage({
          body: {
            language: newEd?.language || '',
            proficiency: newEd?.proficiency || '',
          },
        });
        // console.log('language response:', JSON.stringify(response));
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
        setEditables(e => [...e.filter(ex => ex?.id)]);
        showMessage({
          message: 'You have added a language',
          type: 'success',
        });
        loadUserLanguages();
      } catch (error) {
        console.log('language error:', error);
      }
    },
    [addLanguage, editables, loadUserLanguages],
  );

  const removeLanguage = useCallback(async () => {
    try {
      if (!selectedDeleteId) {
        showMessage({
          message: 'Kindly select an language to delete',
          type: 'danger',
        });
        return;
      }
      const response = await deleteLanguage({
        id: selectedDeleteId,
      });
      setSelectedDeleteId('');
      // console.log('signup response:', JSON.stringify(response));
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
        message: 'You have removed a language',
        type: 'success',
      });
      loadUserLanguages();
    } catch (error) {
      console.log('wwork error:', error);
    }
  }, [selectedDeleteId, deleteLanguage, loadUserLanguages]);

  const addNew = () => {
    setEditables(e => [
      ...e,
      {
        language: '',
        proficiency: '',
      },
    ]);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd();
    }, 500);
  };

  useEffect(() => {
    setEditables(languages);
  }, [languages]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <DeleteConfirmModal
            isVisible={selectedDeleteId.trim().length > 0 && !deleteLoading}
            closeModal={() => setSelectedDeleteId('')}
            title="Want to delete this language?"
            subtitle="This language wil be deleted from your profile. Are you sure?"
            confirmDelete={() => {
              removeLanguage();
            }}
          />
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
                  <Box flexDirection="row">
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
                      Languages
                    </Text>
                  </Box>
                  <Box padding="s">
                    <TouchableOpacity
                      onPress={() => {
                        addNew();
                      }}>
                      <MaterialCommunityIcons
                        name="plus"
                        size={24}
                        color={foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box flex={1}>
                  <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}>
                    {(deleteLoading || educationLoading || createLoading) && (
                      <Box alignItems="center">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                    {editables.length < 1 && (
                      <EmptyState
                        subtitle="No language added yet"
                        buttonText="Add language"
                        doSomething={() => {
                          addNew();
                        }}
                      />
                    )}
                    <Box
                      onStartShouldSetResponder={() => true}
                      paddingHorizontal="mid"
                      paddingVertical="l"
                      gap="l">
                      {editables.map((s, index) => (
                        <Box
                          key={s.id}
                          borderRadius={8}
                          borderWidth={1}
                          padding="mid"
                          borderColor="border">
                          <Box>
                            <Input
                              label="Language"
                              required
                              value={s.language}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                newEditable[index].language = v;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box>
                            <Select
                              required
                              search
                              label="Select Proficiency"
                              onSelect={v => {
                                const newEditable = [...editables];
                                newEditable[index].proficiency = v;
                                setEditables(newEditable);
                              }}
                              data={[
                                {
                                  title: 'Basic',
                                  value: 'Basic',
                                },
                                {
                                  title: 'Intermediate',
                                  value: 'Intermediate',
                                },
                                {
                                  title: 'Advanced',
                                  value: 'Advanced',
                                },
                                {
                                  title: 'Fluent',
                                  value: 'Fluent',
                                },
                                {
                                  title: 'Native',
                                  value: 'Native',
                                },
                              ]}
                              value={s.proficiency || ''}
                            />
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid"
                            marginBottom="m"
                            marginTop="m">
                            <Box flex={1}>
                              <Button
                                onPress={() => {
                                  if (s?.id) {
                                    setSelectedDeleteId(s.id);
                                  } else {
                                    setEditables(e =>
                                      e.filter(
                                        ex =>
                                          ex?.id !== undefined &&
                                          ex?.id?.trim()?.length > 0,
                                      ),
                                    );
                                  }
                                }}
                                displayText="Delete"
                                textProps={{
                                  color: 'foreground',
                                }}
                                buttonProps={{
                                  backgroundColor: 'background',
                                  borderWidth: 1,
                                  borderColor: 'foreground',
                                }}
                              />
                            </Box>
                            {!s?.id && (
                              <Box flex={1}>
                                <Button
                                  displayText="Save"
                                  onPress={() => {
                                    proceed(s?.id);
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
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

export default ManageLanguagesScreen;
