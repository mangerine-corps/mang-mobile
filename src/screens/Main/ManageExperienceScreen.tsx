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
import { ErrorData, Experience } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import CheckBox from '@/components/CheckBox';
import EmptyState from '@/components/EmptyState';
import Select from '@/components/Select';
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceMutation,
} from '@/state/services/experience.service';

const ManageExperienceScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageExperience'>) => {
  const { experience = [] } = useAuth();
  const { foreground, foreground_primary } = useThemeColors();
  const { loadUserExperience, educationLoading } = useLoadAuth();
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const [editables, setEditables] = useState<Partial<Experience>[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [addExperience, { isLoading: createLoading }] =
    useCreateExperienceMutation();
  const [editExperience, { isLoading: editLoading }] =
    useUpdateExperienceMutation();
  const [deleteExperience, { isLoading: deleteLoading }] =
    useDeleteExperienceMutation();

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

        const response = await (!newEd?.id
          ? addExperience({
              body: {
                company_name: newEd.company_name || '',
                title: newEd.title || '',
                end_month: newEd.end_month || '',
                end_year: newEd.end_year || '',
                employment_type: newEd.employment_type || '',
                isCurrent: newEd.isCurrent || false,
                location: newEd.location || '',
                start_month: newEd.start_month || '',
                start_year: newEd.start_year || '',
              },
            })
          : editExperience({
              body: {
                company_name: newEd.company_name || '',
                title: newEd.title || '',
                end_month: newEd.end_month || '',
                end_year: newEd.end_year || '',
                employment_type: newEd.employment_type || '',
                isCurrent: newEd.isCurrent || false,
                location: newEd.location || '',
                start_month: newEd.start_month || '',
                start_year: newEd.start_year || '',
              },
              id: newEd?.id,
            }));
        console.log('experience response:', JSON.stringify(response));
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
          message: 'Experience updated',
          type: 'success',
        });
        loadUserExperience();
      } catch (error) {
        console.log('expeirence error:', error);
      }
    },
    [editables, addExperience, editExperience, loadUserExperience],
  );

  const removeExperience = useCallback(async () => {
    try {
      if (!selectedDeleteId) {
        showMessage({
          message: 'Kindly select an experience to delete',
          type: 'danger',
        });
        return;
      }
      const response = await deleteExperience({
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
        message: 'Experience updated',
        type: 'success',
      });
      loadUserExperience();
    } catch (error) {
      console.log('wwork error:', error);
    }
  }, [selectedDeleteId, deleteExperience, loadUserExperience]);

  useEffect(() => {
    setEditables(experience);
  }, [experience]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <DeleteConfirmModal
            isVisible={selectedDeleteId.trim().length > 0 && !deleteLoading}
            closeModal={() => setSelectedDeleteId('')}
            title="Want to delete this experience?"
            subtitle="This experience wil be deleted from your profile. Are you sure?"
            confirmDelete={() => {
              removeExperience();
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
                      Experience
                    </Text>
                  </Box>
                  <Box padding="s">
                    <TouchableOpacity
                      onPress={() => {
                        setEditables(e => [
                          ...e,
                          {
                            degree: '',
                            end_month: '',
                            end_year: '',
                            field_of_study: '',
                            isCurrent: false,
                            school_name: '',
                            start_month: '',
                            start_year: '',
                          },
                        ]);
                        setTimeout(() => {
                          scrollRef.current?.scrollToEnd();
                        }, 500);
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
                    {(deleteLoading ||
                      educationLoading ||
                      editLoading ||
                      createLoading) && (
                      <Box alignItems="center">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                    {editables.length < 1 && (
                      <EmptyState
                        subtitle="No education added yet"
                        buttonText="Add education"
                        doSomething={() => {
                          setEditables(e => [
                            ...e,
                            {
                              degree: '',
                              end_month: '',
                              end_year: '',
                              field_of_study: '',
                              isCurrent: false,
                              school_name: '',
                              start_month: '',
                              start_year: '',
                            },
                          ]);
                          setTimeout(() => {
                            scrollRef.current?.scrollToEnd();
                          }, 500);
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
                              label="Title"
                              required
                              value={s.title}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                newEditable[index].title = v;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box>
                            <Select
                              required
                              search
                              label="Employment Type"
                              onSelect={v => {
                                const newEditable = [...editables];
                                newEditable[index].title = v;
                                setEditables(newEditable);
                              }}
                              data={[
                                {
                                  title: 'Full-time',
                                  value: 'Full-time',
                                },
                                {
                                  title: 'Part-time',
                                  value: 'Part-time',
                                },
                                {
                                  title: 'Contract',
                                  value: 'Contract',
                                },
                                {
                                  title: 'Internship',
                                  value: 'Internship',
                                },
                                {
                                  title: 'Volunteer',
                                  value: 'Volunteer',
                                },
                                {
                                  title: 'Freelance',
                                  value: 'Freelance',
                                },
                              ]}
                              value={s.employment_type || ''}
                            />
                          </Box>
                          <Box>
                            <Input
                              label="Company Name"
                              required
                              value={s.company_name}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                const myEdt = { ...newEditable[index] };
                                myEdt.company_name = v || '';
                                newEditable[index] = myEdt;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box>
                            <Input
                              label="Location"
                              required
                              value={s.location}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                newEditable[index].location = v;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <Box flex={1}>
                              <Input
                                label="Start Month"
                                required
                                value={s.start_month}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].start_month = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Input
                                label="Start Year"
                                required
                                value={s.start_year}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].start_year = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <Box flex={1}>
                              <Input
                                label="End Month"
                                required
                                value={s.end_month}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].end_month = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Input
                                label="End Year"
                                required
                                value={s.end_year}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].end_year = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            gap="mid"
                            alignItems="center">
                            <CheckBox
                              size={24}
                              checked={s?.isCurrent}
                              onPress={() => {
                                const newEditable = [...editables];
                                newEditable[index].isCurrent =
                                  !s?.isCurrent || true;
                                setEditables(newEditable);
                              }}
                            />
                            <Text>Currently working in this role</Text>
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid"
                            marginBottom="m"
                            marginTop="xl">
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
                            <Box flex={1}>
                              <Button
                                displayText="Save"
                                onPress={() => {
                                  proceed(s?.id);
                                }}
                              />
                            </Box>
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

export default ManageExperienceScreen;
